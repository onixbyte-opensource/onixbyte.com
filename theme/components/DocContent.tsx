import type { ComponentProps } from "react"
import { MDXProvider } from "@mdx-js/react"
import { Content, useFrontmatter, usePage, useSite } from "@rspress/core/runtime"
import {
  Callout,
  DocContent as OriginalDocContent,
  FallbackHeading,
  getCustomMDXComponent,
  useScrollAfterNav,
} from "@rspress/core/theme-original"
import { HomeSections } from "./HomeSections"

/** Taken from upstream so the two cannot drift apart on an Rspress upgrade. */
type DocContentProps = ComponentProps<typeof OriginalDocContent>

/**
 * The page title, rendered when the page does not supply an `# h1` of its own.
 * Mirrors the private `FallbackTitle` inside `@rspress/core`'s `DocContent`.
 */
function FallbackTitle() {
  const { site } = useSite()
  const { page } = usePage()
  const { headingTitle, title } = page

  if (site.themeConfig.fallbackHeadingTitle === false || headingTitle) return null
  return <FallbackHeading level={1} title={title} />
}

/**
 * Upstream's `DocContent`, with one addition: the bands a page marks
 * `placement: top` render between the page title and the article body.
 *
 * Rspress has no slot for that position. `beforeDocContent` sits above the
 * title, and `afterDocContent` and the `Layout`'s `afterDoc` both sit below the
 * whole article — which is why sections used to land at the foot of the
 * products page. Replacing the component is the only way in.
 *
 * Everything except the inserted `<HomeSections>` is copied from upstream:
 * `useScrollAfterNav` restores the scroll position after a client-side
 * navigation, and the MDX component map is layered as defaults, then the
 * caller's overrides, then the placeholder the compiled MDX uses for callouts.
 * Worth re-diffing whenever Rspress is upgraded.
 *
 * A separate component rather than a branch inside `DocContent`, because the
 * hook below must not be called conditionally — `DocContent` survives
 * client-side navigation, so the number of hooks it calls has to stay constant.
 */
function HoistedDocContent({
  components,
  isOverviewPage = false,
  beforeDocContent,
  afterDocContent,
}: DocContentProps) {
  useScrollAfterNav()

  const mdxComponents = {
    ...getCustomMDXComponent(),
    ...components,
    $$$callout$$$: Callout,
  }

  return (
    <MDXProvider components={mdxComponents}>
      {beforeDocContent}
      {!isOverviewPage && <FallbackTitle />}
      <HomeSections placement="top" />
      <Content />
      {afterDocContent}
    </MDXProvider>
  )
}

/**
 * Renders the page body. Pages with nothing to hoist delegate to upstream
 * rather than re-rendering its markup here.
 *
 * That is not only about drift. Upstream's module carries `doc.css` as a
 * side-effect import, and the only reference to the component above is in a
 * `typeof` — which a bundler may treat as no reference at all. It then drops
 * the module, and the article stylesheet is dropped with it. Keeping a real
 * render path to upstream is what holds those styles in the bundle.
 */
export function DocContent(props: DocContentProps) {
  const { frontmatter } = useFrontmatter()

  const raw = frontmatter?.sections
  const hasHoistedBands =
    Array.isArray(raw) &&
    raw.some((entry) => (entry as { placement?: unknown } | null)?.placement === "top")

  if (!hasHoistedBands) return <OriginalDocContent {...props} />
  return <HoistedDocContent {...props} />
}
