# Contributing to OnixByte Homepage

## Development Setup

This project uses [Rspress](https://rspress.rs) as the static site framework and pnpm as the package manager.

```bash
pnpm install
pnpm dev
```

## Project Structure

```
docs/           # Content (Markdown/MDX), organised by locale
  en-gb/        # British English content
  zh-hans/      # Simplified Chinese content
theme/          # Custom theme overrides
```

## Content Guidelines

- Write content in both English (British) and Simplified Chinese. British
  spelling is required throughout — interface text, documentation, code
  comments and commit messages (`customised`, `centre`, `colour`, and so on).
- Blog posts and documentation articles are licensed under CC-BY-4.0.
- Code contributions are licensed under MIT.

## Navigation and Sidebars

Navigation and sidebar structure live in JSON files beside the content, not in
the theme:

- `_nav.json` sets the top navigation. Its `text` values are i18n keys resolved
  through `i18n.json`, so the `en-gb` and `zh-hans` copies stay identical. Add
  new keys to `i18n.json` for **both** locales — a key present for only one
  locale fails the build.
- `_meta.json` sets sidebar grouping and ordering within a directory. Supplying
  one replaces the generated listing for that directory, so every page you want
  shown must be listed — anything omitted disappears from the sidebar silently.

Do not add a `_meta.json` next to `_nav.json` at the root of a locale
directory; doing so collapses the whole site into one flat sidebar.

## Pull Request Process

1. Ensure the site builds cleanly: `pnpm build`
2. Run linting: `pnpm lint`
3. If adding a new page, include both `en-gb` and `zh-hans` versions.
