import * as path from "node:path"
import { defineConfig } from "@rspress/core"

export default defineConfig({
  root: path.join(__dirname, "docs"),
  title: "OnixByte",
  icon: "/rspress-icon.png",
  logo: {
    light: "/rspress-light-logo.png",
    dark: "/rspress-dark-logo.png",
  },
  themeConfig: {
    socialLinks: [
      {
        icon: "gitlab",
        mode: "link",
        content: "https://git.onixbyte.cn/onixbyte/homepage",
      },
    ],
  },
  markdown: {
    showLineNumbers: true
  },
  lang: "en-gb",
  locales: [
    {
      lang: "en-gb",
      label: "English (Great Britain)",
      title: "OnixByte",
      description: "OnixByte Official",
    },
    {
      lang: "zh-hans",
      label: "简体中文",
      title: "OnixByte",
      description: "OnixByte 官方站点",
    },
  ],
})
