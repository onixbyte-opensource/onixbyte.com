import * as path from "node:path"
import { defineConfig } from "@rspress/core"

export default defineConfig({
  root: path.join(__dirname, "docs"),
  title: "OnixByte",
  icon: "/onixbyte-icon.svg",
  logo: {
    light: "/onixbyte-light-logo.svg",
    dark: "/onixbyte-dark-logo.svg",
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
    showLineNumbers: true,
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
