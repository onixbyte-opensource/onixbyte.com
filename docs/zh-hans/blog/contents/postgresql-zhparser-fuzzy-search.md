---
title: 使用分词在 PostgreSQL 中加速模糊查询
tags:
  - postgresql
  - zhparser
  - full-text-search
  - performance
author:
  name: Siu Jam Oh
  email: jamo.siu@gmail.com
---

## 背景与挑战

随着业务数据量突破 **200 万行**，传统的 `LIKE '%关键词%'` 模糊查询导致数据库 I/O 频繁告警，查询响应时间从毫秒级退化至秒级。为提升检索效率并支持中文语义，我们决定引入 `zhparser` 插件实现全文检索。

## 演进路线与环境适配

本次技术落地经历了四个关键阶段，每个阶段解决了不同的技术核心：

### CentOS 7.9 虚拟机（可行性验证）

- **目标**：验证 `SCWS` + `zhparser` 在旧版系统下的兼容性。
- **核心操作**：在 CentOS 7.9 环境下手动编译 `postgresql-16.2` 源码，完成插件初步跑通。

**结论**：确认了分词方案对中文检索性能的显著提升。

### 本地 Docker 容器（容器化探索）

- **目标**：在本地的完整系统进行初步测试。
- **核心操作**：通过 `docker cp` 注入二进制 `.so` 文件，解决 `ldconfig` 动态链接库路径可见性问题。
- **发现**：识别出 **"词典文件缺失"** 会导致分词退化为单字（助词）的故障点。

### EulerOS 2.0 测试服（自编译环境适配）

- **目标**：适配生产环境的 OS 架构（x86_64）与自编译安装的 PostgreSQL。
- **核心问题**：解决了 `libscws.so.1` 无法加载的报错。
- **关键方案**：
  - 明确了 `postgres` 运行用户对 `/usr/local/scws/lib` 的访问权限需求。
  - 通过修改 `systemd` 服务环境变量或创建 `/usr/lib64` 软链接强制刷新库搜索路径。

### 生产部署预备（最终调优）

- **目标**：确保 200w+ 数据量下的查询稳定性。
- **优化点**：针对"非语义片段（如：古唐合）"查询不到的问题，制定了"全文检索优先 + `pg_trgm` 索引辅助"的降级查询策略。

## 核心安装与配置步骤 (自编译环境)

### 安装 `SCWS` 分词引擎

SCWS 是 `zhparser` 依赖的底层核心，必须先行安装。

1. **下载并解压**：下载源码包（如 `scws-1.2.3`）。
2. **编译安装**：

   ```bash
   ./configure --prefix=/usr/local/scws
   make && make install
   ```

3. **验证库文件**：确保 `/usr/local/scws/lib/libscws.so.1` 存在。

### 编译与安装 `zhparser`

这一步需要用到 PostgreSQL 自编译产生的 `pg_config`。

1. **获取源码**：从 GitHub 克隆 `zhparser` 项目。
2. **指定路径编译**：

   ```bash
   # 确保 pg_config 在 PATH 中，或手动指定
   make USE_PGXS=1 PG_CONFIG=/usr/local/pgsql/bin/pg_config
   make USE_PGXS=1 PG_CONFIG=/usr/local/pgsql/bin/pg_config install
   ```

   *注：`install` 步骤会自动将 `zhparser.so` 放入 PG 的 `pkglibdir`，将脚本放入 `extension` 目录。*

### 解决动态链接库依赖

1. **刷新系统缓存**：

   ```bash
   echo "/usr/local/scws/lib" > /etc/ld.so.conf.d/scws.conf
   ldconfig
   ```

2. **权限检查**：确保运行 `postgres` 的 OS 用户对 `/usr/local/scws/lib` 有 `rx` 权限。
3. **强制软链 (备选)**：若 `ldconfig` 失效，可将库文件软链至 `/usr/lib64`。

### 重启数据库

修改完系统共享库配置后，必须重启 PostgreSQL 进程以重新加载环境变量和链接库。

```bash
## 使用 pg_ctl 重启（自编译路径需根据实际情况调整）
/usr/local/pgsql/bin/pg_ctl -D /usr/local/pgsql/data restart

## 或通过 systemd 重启（如果已注册服务）
systemctl restart postgresql
```

### 数据库内初始化

连接到 `psql`，执行逻辑配置：

```sql
-- 创建扩展
CREATE EXTENSION zhparser;

-- 创建全文检索配置并绑定分词器
CREATE TEXT SEARCH CONFIGURATION chinese (PARSER = zhparser);

-- 添加 Token 映射
ALTER TEXT SEARCH CONFIGURATION chinese ADD MAPPING FOR n,v,a,i,e,l,t,b WITH simple;

-- 【可选】指定自编译路径下的词典位置
-- ALTER DATABASE postgres SET zhparser.dict_path = '/usr/local/scws/etc/dict.utf8.xdb';
```

## 性能分析与避坑指南

### 索引性能瓶颈分析

在测试中发现，即使是精确查询，由于使用了不当的联合索引（`create_time` 在首列），导致产生 `Bitmap Index Scan`，耗时高达 **482ms**。

- **改进**：对检索高频列建立单列 **B-tree** 索引，利用 `Index Scan` 将响应降至 **10ms** 以内。

### GIN 索引与非语义匹配

- **跨词截断问题**：分词引擎基于语义，类似"古唐合"这种截断词可能因为分词边界导致 `@@` 无法命中。
- **应对方案**：采用"瀑布式搜索"。全文检索（FTS）优先；若结果为空，自动降级为 `LIKE` 模糊查询，并配合 `pg_trgm` 索引加速。

## 终极部署方案：双轨并行检索

经过对数据的分析，发现对于账户名称中出现了约 1.24% 的非标准简体中文的数据，并且数据库中也存在部分因为公司名称怪异而导致数据查询不出来的问题，决定采取"分步降级"策略：

- **第一步：全文检索（Fast Track）：** 利用 GIN 索引进行 `@@` 匹配。
- **第二步：结果评估：** 若返回结果为空，且搜索词包含字母或疑似繁体字符。
- **第三步：模糊兜底（Safe Fallback）：** 执行 `LIKE '%关键词%'`。虽然速度较慢，但由于其作为"补漏"逻辑，触发频率仅为 1% 左右，不会对数据库造成整体压力。

## 搜索优化：集成自定义业务词库

为了解决全文检索中公司品牌名被误切（如"元一"被切分为数词/量词）的问题，需构建一套从数据提取到索引重建的自动化维护链路。

### 词库提取与预处理

利用 **`companynameparser`** 的结构化解析能力剥离地名与行业后缀，并结合 **`jieba`** 进行语义复核，确保核心品牌词的完整性：

- **提取逻辑**：通过 Python 脚本遍历全量 `buyer_unique_name`，提取核心 `brand` 字段。
- **权重补偿**：针对包含"元"、"一"、"三"等易碎词条，手动将 TF（词频权重）提升至 **50.0 - 60.0**，确保其优先级高于内置量词规则。
- **输出规范**：输出符合 SCWS 标准的 4 字段 `UTF-8` 文本（WORD, TF, IDF, ATTR），建议使用制表符 `\t` 分隔以规避解析异常。

### 词库编译与部署

:::tip
对于使用 Windows 进行编译 `xdb` 二进制词典文件的用户，可以前往 OnixByte 的 [GitHub](https://github.com/onixbyte/scws/releases/tag/1.2.3) 或 [GitLab](https://git.onixbyte.cn/onixbyte/scws/-/releases/1.2.3) 页面下载使用 MingW 预编译好的，适用于 Windows 的原生 scws 命令行工具。
:::

将文本词典转换为 SCWS 高效二进制格式（XDB）：

1. **编译二进制词典**：

   ```bash
   # 使用 scws-gen-dict 工具生成加密二进制词库
   /usr/local/scws/bin/scws-gen-dict -i custom_company.txt -o /usr/local/scws/etc/custom_company.xdb -c utf8
   ```

2. **文件分发与权限**：将生成的 `.xdb` 文件移动至分词数据目录，并确保 `postgres` 用户具备读取权限：

   ```bash
   cp custom_company.xdb /usr/local/pgsql/share/tsearch_data/
   chown postgres:postgres /usr/local/pgsql/share/tsearch_data/custom_company.xdb
   ```

### 数据库参数固化

修改 `postgresql.conf` 配置文件，强制加载 `zhparser` 及其自定义扩展词库：

```plain text
## 预加载插件库（必须重启生效）
shared_preload_libraries = 'zhparser'

## 加载自定义外部词典（需使用相对 tsearch_data 的路径）
zhparser.extra_dicts = 'custom_company.xdb'
```

### 索引热更新与验证

由于分词规则变动，存量数据必须通过重建索引实现语义同步：

**物理重启服务**：

```bash
su - postgres -c "/usr/local/pgsql/bin/pg_ctl -D /usr/local/pgsql/data restart"
```

**在线重建索引**：利用 `CONCURRENTLY` 关键字，在不阻塞 40 万条数据 DML 操作的前提下刷新 GIN 索引：

```bash
REINDEX INDEX CONCURRENTLY index_name;
```

**分词效能验证**：

```sql
-- 预期结果词性应显示为 n (noun)，而非 x (unknown)
SELECT * FROM ts_debug('chinese', '元一能源');
```

**优化建议：**
- **显式提及权重补偿**：这是解决"元一"分词失败（显示为 `x`）的关键技术点。
- **区分重启与重载**：明确 `shared_preload_libraries` 必须通过 `restart` 激活。
