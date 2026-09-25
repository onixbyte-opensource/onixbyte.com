/**
 * Flip to `true` while drafting copy: sections with no content then render a
 * dashed outline naming their type, instead of collapsing to nothing.
 *
 * MUST be `false` before release — confirm this file is the only match:
 *   grep -rn SHOW_COPY_PLACEHOLDERS theme/
 *
 * A plain constant is used rather than `import.meta.env.DEV` because the theme
 * bundle does not guarantee that variable is inlined.
 */
export const SHOW_COPY_PLACEHOLDERS = false
