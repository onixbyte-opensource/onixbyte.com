/**
 * Site-wide constants shared by theme components.
 *
 * Kept here rather than in `rspress.config.ts` so the client bundle can import
 * them without pulling in the Node-side config.
 */

/**
 * Mainland China ICP filing number, as issued.
 *
 * Shown on both targets: the `.com` site redirects mainland-China visitors to
 * `.cn`, so it is the filing number for the domain they land on either way.
 */
export const ICP_NUMBER = "湘ICP备2026042635号-1"

/** Ministry of Industry and Information Technology filing portal. */
export const MIIT_URL = "https://beian.miit.gov.cn/"

/** Locale-relative paths. Prefix with the active language before use. */
export const PRIVACY_PATH = "/legal/privacy"
export const TERMS_PATH = "/legal/terms"
