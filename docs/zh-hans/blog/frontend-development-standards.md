---
title: 前端开发规范
tags:
  - frontend
  - react
  - standards
  - best-practice
author:
  name: Zihlu Wang
  email: real@zihluwang.me
---

## 依赖管理 (pnpm)

- **严格性**: 利用 pnpm 的严格依赖管理，以确保更确定性的 `node_modules` 结构和高效的磁盘空间使用。
- **工作区**: 如果使用 monorepo 方法，配置 pnpm 工作区以简化多个前端包的依赖管理。
- **审计**: 定期使用 `pnpm audit` 审计前端依赖项是否存在已知漏洞。

## API 通信 (Axios)

- **Axios 实例**: 创建一个集中的 Axios 实例用于 API 调用，以应用通用配置（基本 URL、请求头、拦截器）。
- **拦截器**: 使用 Axios 拦截器进行以下操作：
  - 向传出请求添加认证令牌。
  - 处理全局错误响应（例如，显示 `401 Unauthorized` 的通知）。
  - 在开发环境中记录请求/响应。
- **错误处理**: 在 Axios 拦截器或自定义工具函数中集中处理 API 错误，以提供一致的用户反馈。

## React 与组件标准

- **函数组件与 Hooks**: 对于新开发，优先使用带有 React Hooks 的函数组件，而非类组件。
- **Props**:
  - 为组件 props 定义 `interface` 或 `type` 以确保类型安全。
  - 在组件入口处解构 props 以提高清晰度。
- **状态管理 (Redux)**:
  - 使用 Redux Toolkit 进行高效且减少样板代码的 Redux 开发。
  - 使用 `createSlice` 将 Redux 逻辑组织成"切片"（特定功能的 reducer、action 和 selector）。
  - 遵循"ducks"模式或"slices"方法来协同定位 Redux 逻辑。
- **组件组合**: 将复杂的 UI 分解为更小、可重用且职责单一的组件。
- **Ant Design**:
  - 利用 Ant Design 组件以实现一致的 UI/UX。
  - 如果需要，使用 CSS-in-JS 解决方案在整个应用程序中一致地定制 Ant Design 主题和样式。
- **可访问性**: 从一开始就设计和实现考虑到 Web 可访问性 (a11y) 的组件。
