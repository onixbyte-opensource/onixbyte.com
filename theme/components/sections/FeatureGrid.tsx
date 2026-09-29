import type { Feature } from "@rspress/core"
import { HomeFeature } from "@rspress/core/theme-original"
import { arr, str, type FeatureCard } from "./types"

/** The badge is interpolated into markup, so it cannot carry its own markup. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

/**
 * Card grid used for both the homepage advantages and the products/services
 * grids. Delegates to the stock `HomeFeature`, which already handles `span`,
 * icons and the reveal animation — it accepts a `features` prop precisely so it
 * can be driven from somewhere other than page frontmatter.
 *
 * A card's `badge` is folded into the front of `details` as a span, because
 * `HomeFeature` renders `details` through `renderHtmlOrText` (which passes HTML
 * through) and exposes no other slot. Note this makes the whole `details` string
 * render as HTML for badged cards — frontmatter is first-party, and
 * `renderHtmlOrText` already does this for any string containing a tag.
 */
export function FeatureGrid({ items }: { items?: FeatureCard[] }) {
  const features = arr<FeatureCard>(items)?.map(({ badge, ...feature }) => {
    const label = str(badge)
    if (!label) return feature as Feature
    const details = str(feature.details) ?? ""
    return {
      ...feature,
      details: `<span class="rp-card-badge">${escapeHtml(label)}</span>${details}`,
    } as Feature
  })
  if (!features) return null
  return <HomeFeature features={features} />
}
