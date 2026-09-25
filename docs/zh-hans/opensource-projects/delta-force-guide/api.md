---
title: Delta Force Guide API
---

## 后端 API 概览

后端是基于 Spring Boot 3 的应用程序，代码组织在基础包 `com.onixbyte.deltaforceguide` 下：

| 包 | 描述 |
|---|---|
| `controller` | REST API 端点控制器 |
| `service` | 业务逻辑层 |
| `repository` | MyBatis 数据访问层 |
| `domain` | JPA 实体与领域对象 |
| `config` | Spring 配置（安全、缓存等） |
| `properties` | 配置属性类 |
| `enumeration` | 枚举类型 |
| `shared` | 共享工具类 |

## API 端点

### 认证

| 方法 | 路径 | 描述 | 认证 |
|---|---|---|---|
| `POST` | `/api/auth/login` | 使用凭证登录 | 否 |
| `POST` | `/api/auth/refresh` | 刷新 access token | 否 |
| `GET` | `/api/auth/profile` | 获取当前用户信息 | 是 |

### 枪械

| 方法 | 路径 | 描述 |
|---|---|---|
| `GET` | `/api/firearms` | 枪械列表（分页，可按类型筛选） |
| `GET` | `/api/firearms/:id` | 按 ID 获取枪械详情 |
| `POST` | `/api/firearms` | 创建新枪械 |
| `PUT` | `/api/firearms/:id` | 更新枪械信息 |
| `DELETE` | `/api/firearms/:id` | 删除枪械 |

### 改装

| 方法 | 路径 | 描述 |
|---|---|---|
| `GET` | `/api/modifications` | 改装列表（分页，可按枪械和标签筛选） |
| `GET` | `/api/modifications/:id` | 按 ID 获取改装详情 |
| `POST` | `/api/modifications` | 创建改装 |
| `POST` | `/api/modifications/batch` | 批量创建改装 |
| `PUT` | `/api/modifications/:id` | 更新改装 |
| `DELETE` | `/api/modifications/:id` | 删除改装 |
| `DELETE` | `/api/modifications/batch-delete` | 批量删除改装 |

### 标签

| 方法 | 路径 | 描述 |
|---|---|---|
| `GET` | `/api/tags` | 获取所有标签 |

## 前端路由

| 路径 | 布局 | 页面 | 描述 |
|---|---|---|---|
| `/` | 主布局 | 枪械浏览 | 首页 — 枪械列表 |
| `/firearms` | 主布局 | 枪械浏览 | 枪械详情与搜索 |
| `/mod-codes` | 主布局 | 改装代码 | 改装代码库 |
| `/legal` | 主布局 | 法律信息 | 法律与隐私信息 |
| `/login` | 空白布局 | 登录 | 用户认证页面 |

## 前端状态管理

Redux Toolkit 结合 Redux Persist 管理以下状态：

- **认证状态** — Access token、refresh token、用户信息
- **设置状态** — 用户偏好，持久化至本地存储

## API 客户端

前端使用基于 Axios 封装的共享 `WebClient`，提供以下能力：

- 基础 URL 配置（指向后端 API）
- 通过请求拦截器自动注入 JWT access token
- 在收到 401 响应时自动刷新 token

## 基础设施

| 组件 | 技术 |
|---|---|
| 数据库 | PostgreSQL（使用 Flyway 进行数据库迁移） |
| 缓存 | Redis（会话和 token 存储） |
| 文件存储 | AWS S3（枪械图片） |
| 容器化 | Docker |
| 部署 | Docker Compose + Nginx |
