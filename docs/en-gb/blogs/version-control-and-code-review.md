---
title: Version Control and Code Review
tags:
  - git
  - code-review
  - best-practice
  - workflow
author:
  name: Zihlu Wang
  email: real@zihluwang.me
---

## GitFlow Workflow

Version control will use the GitFlow branching model, consisting of `main`, `develop`, `feature`, `release`, and
`hotfix` branches.

- `main`: Production-ready code. Only `release` and `hotfix` branches are merged into `main`.
- `develop`: Integration branch for upcoming features.
- `feature/*`: Branches for new features, branched off `develop`.
- `release/*`: Branches for preparing new production releases, branched off `develop`.
- `hotfix/*`: Branches for urgent production bug fixes, branched off `main`.

## Pull Requests/Merge Requests

All code changes (except direct pushes to feature branches) must be submitted via pull requests.

## Code Review

- Each pull request must be reviewed by at least one other developer.
- Reviewers are responsible for checking compliance with these coding standards, code quality, logical correctness, and
  test coverage.
- IntelliJ IDEA's integrated code analysis tools should be run locally before creating a PR.

## Commit Messages

Write clear, concise, and descriptive commit messages that explain what was changed and why. If possible, follow the
Conventional Commits format (e.g., `feat: add user registration endpoint`).
