import * as path from "node:path"
import { writeFile } from "node:fs/promises"
import { defineConfig } from "@rspress/core"
import type { RspressPlugin, SocialLink, UserConfig } from "@rspress/core"
import { pluginSitemap } from "@rspress/plugin-sitemap"
import { DOUYIN_ICON } from "./theme/lib/social-icons"

/**
 * Which deployment this build targets.
 *
 * The two builds differ in more than colour: `onixbyte.cn` is hosted in
 * mainland China, so its build points every absolute URL at the `.cn` origin
 * and omits links to sites that are not reliably reachable from there.
 *
 * Build with `pnpm build:com` / `pnpm build:cn` — see `package.json`. Both
 * write to `doc_build`, so run and deploy them one at a time.
 */
export type SiteTarget = "com" | "cn"

const ORIGINS: Record<SiteTarget, string> = {
  com: "https://onixbyte.com",
  cn: "https://onixbyte.cn",
}

/** Locale used for the unprefixed routes. */
const DEFAULT_LANG = "en-gb"

/** hreflang and Open Graph locale codes, keyed by Rspress lang. */
const HREFLANG: Record<string, string> = { "en-gb": "en-GB", "zh-hans": "zh-Hans" }
const OG_LOCALE: Record<string, string> = { "en-gb": "en_GB", "zh-hans": "zh_CN" }

/**
 * Social links, split by whether they are reliably reachable from mainland
 * China. The `.cn` build renders only the `domestic` set.
 *
 * To move a link between builds, move it between these two arrays — nothing
 * else needs to change.
 */
const SOCIAL_LINKS: Record<"domestic" | "international", SocialLink[]> = {
  domestic: [
    {
      icon: "github",
      mode: "link",
      content: "https://github.com/onixbyte-opensource",
    },
    {
      // Rspress has no preset Douyin icon, so the artwork is supplied inline —
      // see `theme/lib/social-icons.ts` for the expected markup.
      icon: { svg: DOUYIN_ICON },
      mode: "link",
      content: "https://v.douyin.com/8PlxMzXors0/",
    },
  ],
  international: [
    {
      icon: "x",
      mode: "link",
      content: "https://x.com/onixbyte",
    },
  ],
}

/**
 * Per-route sitemap priorities.
 *
 * `loc` is deliberately absent. The plugin builds a full entry (including `loc`)
 * and then spreads `customMaps[routePath]` over it, so `loc` is genuinely
 * optional — its own documentation shows entries without one. The published
 * type nonetheless marks `loc` as required, so the assertion at the call site
 * bridges that mismatch. `SitemapOverrides` is what keeps the priority values
 * themselves checked.
 */
type CustomMapsOption = NonNullable<Parameters<typeof pluginSitemap>[0]["customMaps"]>
type SitemapOverrides = Record<string, Omit<CustomMapsOption[string], "loc">>

const SITEMAP_PRIORITIES = {
  "/products/": { priority: "1.0" },
  "/zh-hans/products/": { priority: "1.0" },
  "/services/": { priority: "1.0" },
  "/zh-hans/services/": { priority: "1.0" },
  "/opensource-projects/": { priority: "0.8" },
  "/zh-hans/opensource-projects/": { priority: "0.8" },
} satisfies SitemapOverrides

const localePrefix = (lang: string) => (lang === DEFAULT_LANG ? "" : `/${lang}`)

/** Strips the language prefix, always returning a leading slash. */
function bareRoutePath(routePath: string, lang: string): string {
  const prefix = localePrefix(lang)
  const rest = prefix && routePath.startsWith(prefix) ? routePath.slice(prefix.length) : routePath
  return rest.startsWith("/") ? rest : `/${rest}`
}

/**
 * Writes `robots.txt` at build time.
 *
 * It cannot live in `docs/public/`, because a single static file would have to
 * carry the wrong origin for one of the two targets.
 */
function pluginRobots(origin: string): RspressPlugin {
  return {
    name: "plugin-onixbyte-robots",
    async afterBuild(config: UserConfig) {
      const outDir = path.resolve(process.cwd(), config.outDir ?? "doc_build")
      const body = ["User-agent: *", "Allow: /", "", `Sitemap: ${origin}/sitemap.xml`, ""].join(
        "\n"
      )
      await writeFile(path.join(outDir, "robots.txt"), body, "utf8")
    },
  }
}

export function createConfig(target: SiteTarget): UserConfig {
  const origin = ORIGINS[target]
  const socialLinks = [
    ...SOCIAL_LINKS.domestic,
    ...(target === "cn" ? [] : SOCIAL_LINKS.international),
  ]

  return defineConfig({
    root: path.join(__dirname, "docs"),
    title: "OnixByte",
    description:
      "OnixByte builds self-developed SaaS products and delivers custom software engineering services.",
    icon: "/onixbyte-icon.svg",
    logo: {
      light: "/onixbyte-light-logo.svg",
      dark: "/onixbyte-dark-logo.svg",
    },
    /**
     * Per-route `<head>` additions.
     *
     * `og:title`, `og:description`, `description` and `og:type` are
     * deliberately absent: the theme's `HeadTags` already emits them from the
     * page title and site description, and site-level `head` entries do not
     * take part in its de-duplication — adding them here would produce
     * duplicate tags.
     */
    head: [
      (route) => {
        const canonical = `${origin}${route.routePath}`
        const bare = bareRoutePath(route.routePath, route.lang)
        const otherLang = route.lang === DEFAULT_LANG ? "zh-hans" : DEFAULT_LANG
        const alternate = `${origin}${localePrefix(otherLang)}${bare === "/" ? "/" : bare}`
        const defaultUrl = `${origin}${bare === "/" ? "/" : bare}`

        return [
          `<link rel="canonical" href="${canonical}">`,
          `<link rel="alternate" hreflang="${HREFLANG[route.lang]}" href="${canonical}">`,
          `<link rel="alternate" hreflang="${HREFLANG[otherLang]}" href="${alternate}">`,
          `<link rel="alternate" hreflang="x-default" href="${defaultUrl}">`,
          `<meta property="og:url" content="${canonical}">`,
          `<meta property="og:site_name" content="OnixByte">`,
          `<meta property="og:locale" content="${OG_LOCALE[route.lang]}">`,
          `<meta property="og:image" content="${origin}/og-image.png">`,
          `<meta name="twitter:card" content="summary_large_image">`,
        ].join("")
      },
    ],
    themeConfig: {
      // NOTE: `footer` is intentionally not set — the site footer is the
      // `SiteFooter` component wired through the Layout `bottom` slot. Setting
      // `footer.message` here would render the built-in `HomeFooter` on top of
      // it on the home page only.
      //
      // `nav` and `sidebar` are also intentionally not set: supplying either
      // switches off auto-generation and would make every `_nav.json` and
      // `_meta.json` inert.
      socialLinks,
      lastUpdated: true,
    },
    markdown: {
      showLineNumbers: true,
    },
    lang: DEFAULT_LANG,
    locales: [
      {
        lang: "en-gb",
        label: "English (Great Britain)",
        title: "OnixByte",
        description:
          "OnixByte builds self-developed SaaS products and delivers custom software engineering services.",
      },
      {
        lang: "zh-hans",
        label: "简体中文",
        title: "OnixByte",
        description: "曜珀科技自主研发 SaaS 产品，并提供定制化软件开发服务。",
      },
    ],
    // Local full-text search. This is already the Rspress v2 default; stated
    // explicitly so the intent is visible. The index is emitted per locale to
    // `static/search_index.<lang>.<hash>.json` at build time.
    search: {
      mode: "local",
      codeBlocks: true,
    },
    plugins: [
      pluginSitemap({
        siteUrl: origin,
        defaultChangeFreq: "weekly",
        defaultPriority: "0.5",
        // Keys are full route paths, so the non-default locale needs its own
        // entries — `/products/` does not match `/zh-hans/products/`.
        // Double assertion rather than a plain cast: the plugin's `Sitemap` type
        // requires `loc`, so the two types do not overlap enough for a single
        // assertion. See `SITEMAP_PRIORITIES` above for why omitting it is right.
        customMaps: SITEMAP_PRIORITIES as unknown as CustomMapsOption,
      }),
      pluginRobots(origin),
    ],
  })
}

export default createConfig("com")
