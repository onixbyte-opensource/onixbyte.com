# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server with HMR
pnpm build      # Production build for .com (outputs to doc_build/)
pnpm build:com  # Explicit .com build
pnpm build:cn   # Production build for .cn
pnpm preview    # Preview the production build locally
pnpm lint       # ESLint (flat config)
pnpm typecheck  # TypeScript, no emit
pnpm format     # Prettier — format all files
```

## Build targets

`rspress.config.ts` exports a `createConfig(target)` factory; `rspress.cn.config.ts`
is a three-line wrapper calling it with `"cn"`, passed via `--config`. The two
targets differ in the canonical origin used for `head`, the sitemap and
`robots.txt`, and in which social links are rendered. Both write to `doc_build/`,
so build and deploy one target at a time.

## Architecture

- **Rspress v2** static site (like VitePress but Rust-based toolchain). Site generated from MDX/markdown files.
- **Content root**: `docs/` — all pages live here, split into mirrored `en-gb/` and `zh-hans/` trees. Configured as `root` in `rspress.config.ts`.
- **Navigation**: `docs/<locale>/_nav.json` defines the top-level nav; `text` values are i18n keys resolved through the root `i18n.json`, which is why both locale copies are identical. Sidebar grouping and ordering are controlled by `_meta.json` files within subdirectories.
- **Custom theme**: `theme/index.tsx` re-exports everything from `@rspress/core/theme-original` and imports `index.css`. To customize any default theme component, import it and export it back — this is the standard Rspress theme override mechanism.
- **CSS**: `theme/index.css` overrides CSS custom properties (`--rp-c-brand`, `--rp-c-brand-dark`, `--rp-c-brand-tint`) to set brand colours.
- **MDX**: Content pages use `.mdx` when embedding React components, `.md` for plain Markdown. MDX type-checking is enabled via `tsconfig.json` `mdx.checkMdx`.
- **pnpm** is the package manager, pinned via `packageManager` in `package.json` (see `pnpm-lock.yaml`).

## Rspress gotchas

- **Never add `_meta.json` beside `_nav.json`** at the root of a locale directory.
  With both present, Rspress emits a single flat sidebar and silently discards
  every per-section one.
- **Never set `themeConfig.nav` or `themeConfig.sidebar`** in
  `rspress.config.ts`. Either one switches off auto-generation and makes all
  `_nav.json` / `_meta.json` files inert.
- **Never set `themeConfig.footer`**. The site footer is the `SiteFooter`
  component wired through the `Layout` `bottom` slot; setting `footer.message`
  renders the built-in `HomeFooter` as well, on the home page only.
- Entries in the site-level `head` array are **not** de-duplicated against the
  theme's own meta tags. `og:title`, `og:description`, `description` and
  `og:type` are already emitted from page metadata — do not repeat them there.
- A `_meta.json` that omits a page drops it from the sidebar with no warning.
- Dead markdown links fail the production build, but links in `_nav.json`,
  `_meta.json`, `hero.actions` and React components do not.

## Conventions

- British English throughout — interface text, documentation, code comments and
  commit messages.

## Rules

- **Do not run `git push`** after committing unless the user explicitly asks for it. CI/CD pipelines are triggered on push, so the user will batch up work and push manually when everything is complete.
