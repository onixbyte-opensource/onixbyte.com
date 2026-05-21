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

> This article only aims at using `MyBatis Flex` in Spring Boot 3

## Installation and Configuration

### Installation

Add the following codes to `libs.versions.toml` in `gradle` :

```toml
[versions]
mybatisFlexVersion = "X.Y.Z"
hikariVersion = "X.Y.Z"

[libraries]
hikari = { group = "com.zaxxer", name = "HikariCP", version.ref = "hikariVersion" }
mybatisFlex-processor = { group = "com.mybatis-flex", name = "mybatis-flex-processor", version.ref = "mybatisFlexVersion" }
mybatisFlex-starter = { group = "com.mybatis-flex", name = "mybatis-flex-spring-boot3-starter", version.ref = "mybatisFlexVersion" }
```
