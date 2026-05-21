---
title: MyBatis Flex
tags:
  - java
  - mybatis
  - spring-boot
  - orm
  - framework
author:
  name: Zihlu Wang
  email: real@zihluwang.me
---

> 本文仅针对在 Spring Boot 3 中使用 `MyBatis Flex`

## 安装与配置

### 安装

在 `gradle` 目录下的 `libs.versions.toml` 中添加如下代码：

```toml
[versions]
mybatisFlexVersion = "X.Y.Z"
hikariVersion = "X.Y.Z"

[libraries]
hikari = { group = "com.zaxxer", name = "HikariCP", version.ref = "hikariVersion" }
mybatisFlex-processor = { group = "com.mybatis-flex", name = "mybatis-flex-processor", version.ref = "mybatisFlexVersion" }
mybatisFlex-starter = { group = "com.mybatis-flex", name = "mybatis-flex-spring-boot3-starter", version.ref = "mybatisFlexVersion" }
```
