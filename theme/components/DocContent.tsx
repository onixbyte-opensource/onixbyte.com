import type { ComponentProps } from "react"
import { MDXProvider } from "@mdx-js/react"
import { Content, usePage, useSite } from "@rspress/core/runtime"
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
 * Mirrors `@rspress/core`'s `DocContent`, with one addition: the bands a page
 * marks `placement: top` render between the page title and the article body.
 *
 * Rspress has no slot for that position. `beforeDocContent` sits above the
 * title, and `afterDocContent` and the `Layout`'s `afterDoc` both sit below the
 * whole article — which is why sections used to land at the foot of the
 * products page. Replacing this component is the only way in, so it is a
 * deliberate copy of upstream and is worth re-diffing whenever Rspress is
 * upgraded. Everything below comes straight from upstream: `useScrollAfterNav`
 * restores the scroll position after a client-side navigation, and the MDX
 * component map is layered as defaults, then the caller's overrides, then the
 * placeholder the compiled MDX uses for callouts.
 *
 * Every page rendering through `DocLayout` goes through here, so be careful:
 * a mistake affects blogs and project pages as much as the marketing ones.
 */
export function DocContent({
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
