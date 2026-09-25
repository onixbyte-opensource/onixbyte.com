import { useFrontmatter, useI18n, useLang, useSite } from "@rspress/core/runtime"
import { Link } from "@rspress/core/theme-original"
import type { CustomI18n } from "../lib/i18n"
import { ICP_NUMBER, MIIT_URL, PRIVACY_PATH, TERMS_PATH } from "../lib/site"

/**
 * Site-wide footer, injected through the `Layout` bottom slot so it appears on
 * every page type.
 *
 * The built-in `HomeFooter` only renders when `themeConfig.footer.message` is
 * set, and it has no per-locale switching — so it is deliberately left unset in
 * `rspress.config.ts` and this component is the single source of the footer.
 */
export function SiteFooter() {
  const t = useI18n<CustomI18n>()
  const lang = useLang()
  const { site } = useSite()
  const { frontmatter } = useFrontmatter()

  if (frontmatter?.hideSiteFooter === true) return null

  // Rspress strips the language prefix from routes in the default language,
  // so only non-default locales need one.
  const prefix = lang === site.lang ? "" : `/${lang}`

  return (
    <footer className="mt-16 border-t border-(--rp-c-divider-light)">
      <div
        className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-8 text-sm
                   text-(--rp-c-text-2) md:flex-row md:items-center md:justify-between">
        <p className="m-0">{t("footer.copyright")}</p>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {/* `Link` already applies the `rp-link` class itself. */}
          <Link href={`${prefix}${PRIVACY_PATH}`}>{t("footer.privacy")}</Link>
          <Link href={`${prefix}${TERMS_PATH}`}>{t("footer.terms")}</Link>
          {/* The filing number must stay visible text and link to the MIIT
              portal, per Chinese ICP requirements. */}
          <a className="rp-link" href={MIIT_URL} target="_blank" rel="noopener noreferrer">
            {ICP_NUMBER}
          </a>
        </nav>
      </div>
    </footer>
  )
}
