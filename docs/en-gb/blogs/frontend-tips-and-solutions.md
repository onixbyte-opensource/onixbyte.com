---
title: Frontend Tips and Solutions Cheatsheet
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

## Decoupling Form Components

Split form components into UI components and logic components. Use the UI components inside the logic components for rendering styles.

## React Entry Component Order

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
        {/* Note: StyleProvider must be the parent of ConfigProvider!!! */}
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

## Integrating Ant Design with Tailwind CSS in React

> Reference: [https://github.com/ant-design/ant-design/discussions/56152](https://github.com/ant-design/ant-design/discussions/56152)

```css
/* index.css */

@layer theme, base, antd, components, utilities;
@import "../../../node_modules/.pnpm/tailwindcss@4.3.0/node_modules/tailwindcss/dist/lib.d.mts";
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
