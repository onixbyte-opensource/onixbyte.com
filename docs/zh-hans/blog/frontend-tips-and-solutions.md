---
title: 前端开发技巧与方案速查手册
tags:
  - frontend
  - react
  - ant-design
  - tailwind
  - best-practice
author:
  name: Zihlu Wang
  email: real@zihluwang.me
---

## 表单组件的解耦

将表单组件拆分为 UI 组件和逻辑组件，并在逻辑组件中使用 UI 组件渲染样式。

## React 入口组件顺序

```typescript
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Provider as ReduxProvider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { RouterProvider } from "react-router"
import { App as AntApp, ConfigProvider as AntConfigProvider } from "antd"
import { StyleProvider } from "@ant-design/cssinjs"
import AntSimplifiedChinese from "antd/locale/zh_CN"
import "./index.css"
import "@/config/dayjs-config"
import store, { persistor } from "@/store"
import router from "@/router"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* 注意：StyleProvider 必须是 ConfigProvider 的父组件！！！ */}
        <StyleProvider layer>
          <AntConfigProvider
            locale={AntSimplifiedChinese}
            button={{
              autoInsertSpace: false,
            }}>
            <AntApp className="h-full w-full">
              <RouterProvider router={router} />
            </AntApp>
          </AntConfigProvider>
        </StyleProvider>
      </PersistGate>
    </ReduxProvider>
  </StrictMode>
)
```

## React 中 Ant Design 与 Tailwind 整合

> 参考 [https://github.com/ant-design/ant-design/discussions/56152](https://github.com/ant-design/ant-design/discussions/56152)

```css
/* index.css */

@layer theme, base, antd, components, utilities;
@import "tailwindcss";
```

```typescript
<StyleProvider>
  <ConfigProvider>
    <App>
      <RouterProvider/>
    </App>
  </ConfigProvider>
</StyleProvider>
```
