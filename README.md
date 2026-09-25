# OnixByte Homepage

The official OnixByte site — the company front door, alongside the technical
blog, product documentation and development standards.

## Tech Stack

A static site built with [Rspress](https://rspress.rs/), supporting bilingual
content (`en-gb` / `zh-hans`). All pages are authored in Markdown / MDX.

## URLs

| Domain                               | Recommended For              |
| ------------------------------------ | ---------------------------- |
| [onixbyte.cn](https://onixbyte.cn)   | Users in China mainland      |
| [onixbyte.com](https://onixbyte.com) | Users outside China mainland |

Traffic from mainland China is redirected from `.com` to `.cn` at the edge; see
`vercel.json`. Local full-text search is built into Rspress v2 and needs no
plugin — an index is emitted per locale at build time.

## Requirements

- Node.js 24.x (see `engines` in `package.json`)
- pnpm 12.x — the package manager is pinned via the `packageManager` field

## Local Development

```bash
pnpm install
pnpm dev        # Start dev server with HMR
pnpm build      # Production build for .com, outputs to doc_build/
pnpm build:com  # Explicit .com build (same as `build`)
pnpm build:cn   # Production build for .cn
pnpm preview    # Preview the production build locally
pnpm lint       # ESLint
pnpm typecheck  # TypeScript, no emit
pnpm format     # Prettier — format all files
```

## Build Targets

The site is published on two domains, and the two builds are not
interchangeable. `pnpm build:cn` runs `rspress build --config
rspress.cn.config.ts`, which differs from the default in four ways:

|                                 | `build:com`       | `build:cn`     |
| ------------------------------- | ----------------- | -------------- |
| Default language (unprefixed)   | `en-gb`           | `zh-hans`      |
| Canonical, `hreflang`, `og:url` | `onixbyte.com`    | `onixbyte.cn`  |
| `sitemap.xml`, `robots.txt`     | `onixbyte.com`    | `onixbyte.cn`  |
| Social links                    | GitHub, Douyin, X | GitHub, Douyin |

**The default language differs per target**, so the routes do too. Rspress
serves the default locale without a prefix:

|                 | `.com`                          | `.cn`                         |
| --------------- | ------------------------------- | ----------------------------- |
| English home    | `/`                             | `/en-gb/`                     |
| Chinese home    | `/zh-hans/`                     | `/`                           |
| English article | `/blogs/git-cheatsheet`         | `/en-gb/blogs/git-cheatsheet` |
| Chinese article | `/zh-hans/blogs/git-cheatsheet` | `/blogs/git-cheatsheet`       |

Content paths under `docs/` are unaffected — only the prefixes change, and
Rspress rewrites internal links per locale automatically.

X is omitted from the `.cn` build because it is not reachable from mainland
China. Which links count as domestic is a single list in `rspress.config.ts`
(`SOCIAL_LINKS`) — move an entry between the two arrays to change a build.

Rspress ships preset icons for Weibo, Bilibili, Zhihu, Juejin, QQ and WeChat,
but not for Douyin, and its preset registry cannot be extended from userland.
Douyin's artwork is therefore supplied as inline SVG in
`theme/lib/social-icons.ts`; see that file for the markup shape it must match.

`robots.txt` is written at build time by a small plugin rather than committed
under `docs/public/`, because a single static file would carry the wrong origin
for one of the two targets.

**Both targets write to `doc_build/`.** Build and deploy them one at a time; a
second build overwrites the first. To preview the `.cn` variant in dev, run
`rspress dev --config rspress.cn.config.ts`.

## Directory Structure

```
docs/
├── public/              # Static assets served from the site root
│   └── onixbyte-*.svg
├── en-gb/               # English content
│   ├── _nav.json        # Top navigation; labels are i18n keys
│   ├── index.md         # Marketing homepage
│   ├── blogs/           # Technical articles ("Insights")
│   ├── products/        # Products we run ourselves
│   ├── services/        # Custom engineering services
│   ├── opensource-projects/  # Open-source project documentation
│   ├── notifications/   # Company announcements ("News")
│   └── legal/           # Privacy policy and terms
└── zh-hans/             # Simplified Chinese content (mirrors en-gb exactly)

theme/                   # Custom Rspress theme
├── index.tsx            # Layout overrides and slot wiring
├── index.css            # Brand colours and section styling
├── lib/
│   ├── site.ts          # Shared site constants
│   ├── i18n.ts          # Types i18n.json for useI18n()
│   └── social-icons.ts  # Inline SVG for social links with no preset icon
└── components/
    ├── Author.tsx       # Byline, rendered from `author` frontmatter
    ├── Tags.tsx         # Tag list, rendered from `tags` frontmatter
    ├── Kbd.tsx          # Keyboard-shortcut primitive for MDX
    ├── SiteFooter.tsx   # Site-wide footer, injected via the Layout slot
    ├── HomeSections.tsx # Renders `frontmatter.sections`
    └── sections/        # The individual marketing band components
```

### Navigation and sidebars

Navigation and sidebar structure are driven by JSON files next to the content,
not by the theme:

- `_nav.json` controls the top navigation. Its `text` values are keys resolved
  through `i18n.json`, which is why the two locale files are identical.
- `_meta.json` controls sidebar grouping and ordering within a directory.
  Pages omitted from one are dropped from the sidebar, so keep it complete.

Do not add a `_meta.json` at the root of a locale directory — presence of both
`_nav.json` and `_meta.json` at that level switches Rspress to a single flat
sidebar and discards all the per-section ones.

### Marketing sections

The homepage, `/products/` and `/services/` render optional bands declared in
frontmatter under a `sections` key. Each band renders only when it has content,
so an unfilled page degrades to its heading and intro rather than looking
broken. Supported types are `advantages`, `contentGrid`, `techStack`, `cases`
and `cta`; see `theme/components/sections/types.ts` for their shapes.

`theme/components/sections/placeholder.ts` exposes a `SHOW_COPY_PLACEHOLDERS`
flag that renders a labelled outline for empty bands while copy is being
written. It must be `false` in anything released.

## Deployment

Two targets, each built separately:

- **`onixbyte.com`** — built with `pnpm build:com`, deployed to Vercel from
  `doc_build/`.
- **`onixbyte.cn`** — built with `pnpm build:cn`, rsynced from `doc_build/` to
  the server behind that domain.

There is currently no CI automation in this repository; both are run by hand.
Since the two builds share the `doc_build/` output directory, run the build for
a target immediately before deploying it.

The server behind `onixbyte.cn` needs a `try_files` rule resolving extensionless
paths (`{path} {path}.html {path}/index.html`) — the sitemap and canonical URLs
are extensionless, and without it every one of them 404s on that host.

Redirects for the retired `/projects/` paths live in `vercel.json`. The `.cn`
host needs the equivalent rule in its own web server config, which is not
tracked in this repository.

## Contributing

This repository is **not open for external contributions** — pull requests are
not accepted. Issues reporting broken links, factual errors, typos or
reproducible bugs are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Licence

All rights reserved. Nothing here is licensed for reuse: no permission is
granted to copy, modify or distribute any part of this repository. Reading it
and linking to it are fine. See [LICENCE](./LICENCE) for the full notice, and
[THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for the dependencies, which
keep their own licences.
