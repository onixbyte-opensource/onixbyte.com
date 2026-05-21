---
title: 版本控制与代码审查
tags:
  - git
  - code-review
  - best-practice
  - workflow
author:
  name: Zihlu Wang
  email: real@zihluwang.me
---

## GitFlow 工作流

版本控制将使用 GitFlow 分支模型，包括 `main`、`develop`、`feature`、`release` 和 `hotfix` 分支。

- `main`: 生产就绪代码。只有 `release` 和 `hotfix` 分支会合并到 `main`。
- `develop`: 即将开发的功能集成分支。
- `feature/*`: 用于新功能的分支，从 `develop` 分支出来。
- `release/*`: 用于准备新生产版本的分支，从 `develop` 分支出来。
- `hotfix/*`: 用于紧急生产错误修复的分支，从 `main` 分支出来。

## 拉取请求 (PRs)

所有代码更改（直接推送到功能分支除外）都必须通过拉取请求提交。

## 代码审查

- 每个拉取请求必须由至少一名其他开发人员进行审查。
- 审查者负责检查是否符合本代码标准、代码质量、逻辑正确性和测试覆盖率。
- 在创建 PR 之前，应在本地运行 IntelliJ IDEA 的集成代码分析工具。

## 提交消息

编写清晰、简洁、描述性的提交消息，解释更改了什么以及为什么进行更改。如果可能，遵循约定式提交格式（例如，
`feat: add user registration endpoint`）。
