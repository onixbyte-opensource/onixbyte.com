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

- Write content in both English (British) and Simplified Chinese.
- Blog posts and documentation articles are licensed under CC-BY-4.0.
- Code contributions are licensed under MIT.

## Pull Request Process

1. Ensure the site builds cleanly: `pnpm build`
2. Run linting: `pnpm lint`
3. If adding a new page, include both `en-gb` and `zh-hans` versions.
