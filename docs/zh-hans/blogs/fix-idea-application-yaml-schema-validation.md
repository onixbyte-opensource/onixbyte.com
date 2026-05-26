---
title: 修复 IntelliJ IDEA 中 Spring Boot 的 application.yaml 智能提示消失问题
tags:
  - intellij-idea
  - spring-boot
  - yaml
  - schema-validation
  - troubleshooting
author:
  name: Zihlu Wang
  email: real@zihluwang.me
---

最近在使用 IDEA 开发 Spring Boot 项目时，我发现 `application.yaml` 和 `application.yml` 的智能代码提示突然消失了。更糟糕的是，编辑器中充满了如下警告：

> `Schema validation: Missing required property 'kind' = 'Application'`

## 症状

打开 `src/main/resources/` 下的 `application.yaml` 或 `application.yml` 文件时，IDEA 会将其视为 Enonic XP 应用描述文件，而非 Spring Boot 配置文件。所有 Spring 特有的属性提示全部消失，取而代之的是一堆要求填写 `kind` 属性的 Schema 校验错误——这个字段与 Spring Boot 毫无关系。

重启 IDEA、清除缓存、重新导入项目都无济于事，问题依旧存在。

## 快速修复

经过一番排查，我找到了罪魁祸首。IDEA 会从远程源（具体来说是 [SchemaStore](https://www.schemastore.org/) 目录）下载 JSON Schema，并用它们来校验配置文件。最近的一次 Schema 更新引入了一个匹配范围过大的 `fileMatch` 模式。

要立即禁用此行为：

1. 打开 **Settings**（Ctrl+Alt+S / Cmd+,）
2. 导航至 **Languages & Frameworks → Schemas and DTDs → Remote JSON Schemas**
3. 取消勾选 **Allow downloading JSON Schemas from remote sources**
4. 点击 **OK**

Spring Boot 的配置提示会立刻恢复。

## 根本原因

事情的根源要追溯到 **2026 年 5 月 19 日**，一位来自 [Enonic](https://www.enonic.com/) 的开发者向 SchemaStore 仓库提交了一个 PR（[PR #5704](https://github.com/SchemaStore/schemastore/pull/5704)），添加了 Enonic XP 应用描述文件的 Schema。该 Schema 的 `fileMatch` 属性被设置为：

```json
"fileMatch": [
  "**/src/main/resources/application.yaml",
  "**/src/main/resources/application.yml"
]
```

这个匹配模式过于宽泛——它匹配了 **所有** 位于 `src/main/resources/` 下的 `application.yaml` 和 `application.yml` 文件，而这正是 Spring Boot 项目存放配置文件的位置。一旦该 Schema 被合并到 SchemaStore 中，任何启用了远程 JSON Schema 下载功能的 IntelliJ IDEA 都会拉取它，并开始用 Enonic XP 的 Schema 来校验 Spring Boot 的配置。

该开发者已意识到问题，并提交了后续修复 PR（[PR #5711](https://github.com/SchemaStore/schemastore/pull/5711)）来收紧 `fileMatch` 匹配规则。截至本文撰写时，该修复尚未被 SchemaStore 合并。

## 为什么这很重要

SchemaStore 是一个由社区维护的 JSON Schema 目录，被许多编辑器（VS Code、IntelliJ IDEA、Neovim 等）用来为常见配置文件提供校验和自动补全功能。当该目录中的某个 Schema 声明了过于宽泛的匹配规则时，会影响到所有平台、所有编辑器的用户——不仅仅是 IDEA。

对于 Spring Boot 开发者来说，结论很简单：如果你的 `application.yaml` 提示一夜之间消失了，先检查一下你的 IDE 认为该文件属于哪个 Schema，它可能根本不是 Spring Boot。
