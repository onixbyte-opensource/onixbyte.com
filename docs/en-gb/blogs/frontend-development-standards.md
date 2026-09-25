---
title: Frontend Development Standards
tags:
  - frontend
  - react
  - standards
  - best-practice
author:
  name: Zihlu Wang
  email: real@zihluwang.me
---

## Dependency Management (pnpm)

- **Strictness**: Leverage pnpm's strict dependency management to ensure a more deterministic `node_modules` structure
  and efficient disk space usage.
- **Workspaces**: When using a monorepo approach, configure pnpm workspaces to streamline dependency management across
  multiple frontend packages.
- **Auditing**: Regularly audit frontend dependencies for known vulnerabilities using `pnpm audit`.

## API Communication (Axios)

- **Axios Instance**: Create a centralised Axios instance for API calls to apply common configuration (base URL,
  headers, interceptors).
- **Interceptors**: Use Axios interceptors to:
  - Add authentication tokens to outgoing requests.
  - Handle global error responses (e.g., display a notification for `401 Unauthorized`).
  - Log requests/responses in development environments.
- **Error Handling**: Centralise API error handling in Axios interceptors or custom utility functions to provide
  consistent user feedback.

## React and Component Standards

- **Function Components & Hooks**: Prefer function components with React Hooks over class components for new
  development.
- **Props**:
  - Define `interface` or `type` for component props to ensure type safety.
  - Destructure props at the component entry point for clarity.
- **State Management (Redux)**:
  - Use Redux Toolkit for efficient, boilerplate-reduced Redux development.
  - Use `createSlice` to organise Redux logic into "slices" (feature-specific reducers, actions, and selectors).
  - Follow the "ducks" pattern or "slices" approach to co-locate Redux logic.
- **Component Composition**: Break down complex UIs into smaller, reusable, single-responsibility components.
- **Ant Design**:
  - Leverage Ant Design components for consistent UI/UX.
  - Use CSS-in-JS solutions to consistently customise Ant Design themes and styles across the application if needed.
- **Accessibility**: Design and implement components with web accessibility (a11y) in mind from the start.
