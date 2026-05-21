---
title: Docker Deployment Standards
tags:
  - docker
  - deployment
  - standards
  - best-practice
author:
  name: Zihlu Wang
  email: real@zihluwang.me
---

- **Dockerfiles**: Provide a `Dockerfile` for the application to enable containerised deployment.
- **Lightweight Images**: Strive for lightweight Docker images by using appropriate base images and multi-stage builds.
- **Configuration**: Ensure environment-specific configuration (e.g., database connection strings, external service
  URLs) is managed through environment variables injected into Docker containers.
- **Logging**: Configure containerised logging to output to `stdout` and `stderr` so that log aggregation systems can
  collect logs easily.
