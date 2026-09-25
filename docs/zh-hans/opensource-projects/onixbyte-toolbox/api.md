---
title: OnixByte Toolbox API
---

## 包结构概览

所有模块均在 `com.onixbyte` group ID 下发布。每个模块有自己独立的基础包：

| 模块               | Maven Artifact       | 基础包                           |
| ------------------ | -------------------- | -------------------------------- |
| Common Toolbox     | `common-toolbox`     | `com.onixbyte.common`            |
| Crypto Toolbox     | `crypto-toolbox`     | `com.onixbyte.crypto`            |
| Math Toolbox       | `math-toolbox`       | `com.onixbyte.math`              |
| Tuple              | `tuple`              | `com.onixbyte.tuple`             |
| Identity Generator | `identity-generator` | `com.onixbyte.identitygenerator` |

---

## Common Toolbox

### 适配器

`ObjectMapAdapter` — 对象与 Map 之间的转换器。适用于需要键值表示的场景，如序列化或数据转换。

```java
import com.onixbyte.common.adapter.ObjectMapAdapter;
```

### 工具类

| 类               | 描述                                        |
| ---------------- | ------------------------------------------- |
| `AesUtil`        | AES 对称加密/解密，支持密钥生成             |
| `Base64Util`     | Base64 编解码，支持多种字符集               |
| `BoolUtil`       | 布尔值解析与转换工具                        |
| `BranchUtil`     | 条件分支辅助，支持函数式链式调用            |
| `CollectionUtil` | 集合操作 — 分组、分区、合并                 |
| `HashUtil`       | 哈希工具，支持 MD5、SHA-1、SHA-256、SHA-512 |
| `MapUtil`        | Map 构建、合并和转换辅助                    |
| `RangeUtil`      | 数值范围操作，支持边界处理                  |

**AesUtil 示例：**

```java
var key = AesUtil.generateKey();
var encrypted = AesUtil.encrypt("hello world", key);
var decrypted = AesUtil.decrypt(encrypted, key);
```

**HashUtil 示例：**

```java
var md5 = HashUtil.md5("hello world");
var sha256 = HashUtil.sha256("hello world");
var fileSha = HashUtil.sha256(new File("data.bin"));
```

**CollectionUtil 示例：**

```java
var partitioned = CollectionUtil.partition(list, 100);
var grouped = CollectionUtil.groupBy(users, User::getDepartment);
```

---

## Crypto Toolbox

提供了加载 PEM 格式密钥的简洁抽象。支持 RSA 和 ECDSA 算法。

### 密钥加载器

| 类                    | 描述                         |
| --------------------- | ---------------------------- |
| `RSAPrivateKeyLoader` | 从 PEM 字符串加载 RSA 私钥   |
| `RSAPublicKeyLoader`  | 从 PEM 字符串加载 RSA 公钥   |
| `ECPrivateKeyLoader`  | 从 PEM 字符串加载 ECDSA 私钥 |
| `ECPublicKeyLoader`   | 从 PEM 字符串加载 ECDSA 公钥 |

所有密钥加载器实现 `PrivateKeyLoader` 或 `PublicKeyLoader` 接口。

**RSA 示例：**

```java
var privateKey = new RSAPrivateKeyLoader().load(pemString);
var publicKey = new RSAPublicKeyLoader().load(pemString);
```

**ECDSA 示例：**

```java
var ecPrivateKey = new ECPrivateKeyLoader().load(pemString);
var ecPublicKey = new ECPublicKeyLoader().load(pemString);
```

### 工具类

`CryptoUtil` — 提供便捷的数字签名生成和验证方法，以及通用密码学辅助功能。

### 异常

| 类                    | 描述                       |
| --------------------- | -------------------------- |
| `KeyLoadingException` | PEM 格式密钥解析失败时抛出 |

---

## Math Toolbox

用于处理数值数据集的统计计算工具。

### 核心类

| 类                     | 描述                                                          |
| ---------------------- | ------------------------------------------------------------- |
| `Calculator`           | 统计计算器 — 均值、中位数、方差、标准差、总和、最小值、最大值 |
| `PercentileCalculator` | 百分位数计算器，支持可配置的插值策略                          |

**Calculator 示例：**

```java
var stats = new Calculator(Arrays.asList(1.0, 2.0, 3.0, 4.0, 5.0));
double mean = stats.getMean();
double median = stats.getMedian();
double stdDev = stats.getStandardDeviation();
```

**PercentileCalculator 示例：**

```java
var calculator = new PercentileCalculator(data);
double p95 = calculator.calculate(95);
double p99 = calculator.calculate(99);
```

### 数据模型

| 类               | 描述                                          |
| ---------------- | --------------------------------------------- |
| `QuartileBounds` | 包含 Q1、中位数（Q2）、Q3 值及 IQR 和须线边界 |

---

## Tuple

轻量级泛型元组类型，适用于需要返回多个值但无需定义专用类的场景。

### 类

| 类                         | 类型参数 | 可变性 |
| -------------------------- | -------- | ------ |
| `Tuple<A, B>`              | 两个元素 | 可变   |
| `ImmutableTuple<A, B>`     | 两个元素 | 不可变 |
| `Triple<A, B, C>`          | 三个元素 | 可变   |
| `ImmutableTriple<A, B, C>` | 三个元素 | 不可变 |

**示例：**

```java
var pair = Tuple.of("key", 42);
var triple = Triple.of("id", "name", 100);
var immutable = ImmutableTuple.of("constant", true);

// 访问器
String first = pair.getFirst();
Integer second = pair.getSecond();

// 三元组访问器
String a = triple.getFirst();
String b = triple.getSecond();
Integer c = triple.getThird();
```

---

## Identity Generator

生成适用于数据库主键或分布式 ID 的唯一标识符。

### 接口

`IdentityGenerator<T>` — 生成类型为 `T` 的标识符。

### 实现

| 类                           | 描述                                          |
| ---------------------------- | --------------------------------------------- |
| `SequentialUuidGenerator`    | 生成时间排序的顺序 UUID（优化数据库索引性能） |
| `SnowflakeIdentityGenerator` | 雪花算法分布式唯一 ID 生成                    |

**顺序 UUID：**

```java
var generator = new SequentialUuidGenerator();
UUID id = generator.nextId(); // 时间排序 UUID，对 B-tree 友好
```

**雪花：**

```java
var generator = new SnowflakeIdentityGenerator(workerId, datacenterId);
long id = generator.nextId(); // 64 位雪花 ID
```

### 异常

| 类                | 描述                                       |
| ----------------- | ------------------------------------------ |
| `TimingException` | 系统时钟回拨时抛出，保证 ID 唯一性不受影响 |
