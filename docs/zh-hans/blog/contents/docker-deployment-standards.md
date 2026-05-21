---
title: Docker 部署规范
tags:
  - docker
  - deployment
  - standards
  - best-practice
author:
  name: Zihlu Wang
  email: real@zihluwang.me
---

- **Dockerfiles**: 为应用程序提供 `Dockerfile`，实现容器化部署。
- **轻量级镜像**: 通过使用适当的基础镜像和多阶段构建，力求实现轻量级 Docker 镜像。
- **配置**: 确保环境特定配置（例如，数据库连接字符串、外部服务 URL）通过注入到 Docker 容器中的环境变量进行管理。
- **日志记录**: 配置容器化日志记录，将输出发送到 `stdout` 和 `stderr`，以便日志聚合系统轻松收集。
