# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server with HMR
pnpm build      # Production build (outputs to dist/)
pnpm preview    # Preview the production build locally
pnpm lint       # ESLint (flat config)
pnpm format     # Prettier — format all files
```

## Architecture

- **Rspress** static site (like VitePress but Rust-based toolchain). Documentation site generated from MDX/markdown files.
- **Content root**: `docs/` — all documentation pages live here. Configured as `root` in `rspress.config.ts`.
- **Navigation**: `docs/_nav.json` defines the top-level nav. Sidebar ordering is controlled by `_meta.json` files within subdirectories.
- **Custom theme**: `theme/index.tsx` re-exports everything from `@rspress/core/theme-original` and imports `index.css`. To customize any default theme component, import it and export it back — this is the standard Rspress theme override mechanism.
- **CSS**: `theme/index.css` overrides CSS custom properties (`--rp-c-brand`, `--rp-c-brand-dark`, `--rp-c-brand-tint`) to set brand colors.
- **MDX**: Content pages use `.mdx` when embedding React components, `.md` for plain Markdown. MDX type-checking is enabled via `tsconfig.json` `mdx.checkMdx`.
- **pnpm** is the package manager (see `pnpm-lock.yaml`).

## Rules

- **Do not run `git push`** after committing unless the user explicitly asks for it. CI/CD pipelines are triggered on push, so the user will batch up work and push manually when everything is complete.
