import type { Feature } from "@rspress/core"
import { HomeFeature } from "@rspress/core/theme-original"
import { arr } from "./types"

/**
 * Card grid used for both the homepage advantages and the products/services
 * grids. Delegates to the stock `HomeFeature`, which already handles `span`,
 * icons and the reveal animation — it accepts a `features` prop precisely so it
 * can be driven from somewhere other than page frontmatter.
 */
export function FeatureGrid({ items }: { items?: Feature[] }) {
  const features = arr<Feature>(items)
  if (!features) return null
  return <HomeFeature features={features} />
}
