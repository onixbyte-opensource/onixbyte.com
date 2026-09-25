import "./index.css"
import type { DocLayoutProps, LayoutProps } from "@rspress/core/theme-original"
import {
  DocLayout as OriginalDocLayout,
  Layout as OriginalLayout,
} from "@rspress/core/theme-original"
import { Tags } from "./components/Tags"
import { Author } from "./components/Author"
import { SiteFooter } from "./components/SiteFooter"
import { HomeSections } from "./components/HomeSections"

function DocLayout(props: DocLayoutProps) {
  return (
    <OriginalDocLayout
      {...props}
      beforeOutline={
        <>
          <Author className="mx-4 md:mx-0" />
          {props.beforeOutline}
        </>
      }
      afterDocContent={
        <>
          {props.afterDocContent}
          <Tags />
        </>
      }
    />
  )
}

/**
 * Wraps the stock `Layout` to add the site-wide footer and the frontmatter
 * driven marketing sections.
 *
 * `bottom` is rendered for every page type (home, doc, doc-wide, custom and
 * blank), so this is the one place the footer needs to be attached. Note that
 * the original `Layout` resolves `DocLayout` from `@rspress/core/theme` — the
 * alias for this directory — so the override above is picked up automatically.
 *
 * `afterFeatures` covers the home page and sits below the stock hero and
 * features grid; `afterDoc` covers products, services and any other doc page
 * that declares `sections`. `afterDoc` is a sibling of the doc container rather
 * than part of the prose column, so sections placed there stay full-bleed.
 * `HomeSections` renders nothing without the frontmatter, and the two slots are
 * never both live on the same page.
 */
function Layout(props: LayoutProps) {
  return (
    <OriginalLayout
      {...props}
      bottom={
        <>
          {props.bottom}
          <SiteFooter />
        </>
      }
      afterFeatures={
        <>
          {props.afterFeatures}
          <HomeSections />
        </>
      }
      afterDoc={
        <>
          {props.afterDoc}
          <HomeSections />
        </>
      }
    />
  )
}

export * from "@rspress/core/theme-original"
export { DocLayout, Layout }
export { Kbd } from "./components/Kbd"
