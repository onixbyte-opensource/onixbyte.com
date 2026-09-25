# Contributing to OnixByte Homepage

This repository holds the company website. It is published openly so that the
Rspress set-up can be read and learned from, but it is **not open for external
contributions**.

## We do not accept pull requests

External pull requests are not accepted and will be closed without review.
This is not a comment on the work — it is that a company website is edited by
the people accountable for what it says, and merging outside changes would put
content on the site that nobody here has signed off.

## Issues are welcome

Please do open an issue if you spot:

- a broken or dead link
- something factually wrong, in either language
- a typo, or a place where the British English or Chinese wording is off
- an accessibility problem
- a build or runtime bug you can reproduce

Issues are read, and genuine problems are usually fixed. If a report turns into
a change, we will make that change ourselves.

## Licence

Nothing in this repository is licensed for reuse. See [LICENCE](./LICENCE) —
copyright is retained and no permission is granted to copy, modify or
distribute any part of it. Reading it and linking to it are fine.

Third-party software this project depends on keeps its own licence; see
[THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).

---

The rest of this document is for people working on the site internally.

## Development Setup

This project uses [Rspress](https://rspress.rs) as the static site framework and
pnpm as the package manager.

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
- Marketing pages address the reader as 您; the technical blog keeps the
  peer-to-peer 你.

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

## Before Committing

1. Ensure the site builds: `pnpm build:com` and `pnpm build:cn`
2. Type-check: `pnpm typecheck`
3. Lint and format: `pnpm lint` and `pnpm format`
4. If adding a new page, include both `en-gb` and `zh-hans` versions.
