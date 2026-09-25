import { useFrontmatter } from "@rspress/core/runtime"
import { SectionBand } from "./sections/SectionBand"
import { FeatureGrid } from "./sections/FeatureGrid"
import { TechStack } from "./sections/TechStack"
import { Cases } from "./sections/Cases"
import { CallToAction } from "./sections/CallToAction"
import { hasContent, isHoisted, type Section } from "./sections/types"

/** Type guard for a single entry of `frontmatter.sections`. */
function isSection(value: unknown): value is Section {
  if (typeof value !== "object" || value === null) return false
  const type = (value as { type?: unknown }).type
  return (
    type === "advantages" ||
    type === "contentGrid" ||
    type === "techStack" ||
    type === "cases" ||
    type === "cta"
  )
}

function renderBody(section: Section) {
  switch (section.type) {
    case "advantages":
    case "contentGrid":
      return <FeatureGrid items={section.items} />
    case "techStack":
      return <TechStack groups={section.groups} />
    case "cases":
      return <Cases items={section.items} />
    case "cta":
      return <CallToAction actions={section.actions} code={section.code} />
  }
}

interface HomeSectionsProps {
  /**
   * Which bands this instance renders. Omit it to render all of them in
   * declaration order, which is what the home page wants — it has no article
   * for a band to sit on either side of.
   */
  placement?: "top" | "bottom"
}

/**
 * Renders `frontmatter.sections` in declaration order.
 *
 * Attached to the `Layout` `afterFeatures` (home) and `afterDoc` (products,
 * services) slots, and to the `DocContent` override for hoisted bands. Returns
 * `null` for any page without a `sections` array, so it is inert on blog posts,
 * project pages and every other doc page.
 */
export function HomeSections({ placement }: HomeSectionsProps = {}) {
  const { frontmatter } = useFrontmatter()
  const raw = frontmatter?.sections
  if (!Array.isArray(raw)) return null

  const sections = raw.filter(isSection)
  // The stripe alternates over the page's whole `sections` list rather than
  // over whatever this instance happens to render: hoisting a band must not
  // flip the background of every band below it.
  const visible = sections
    .map((section, index) => ({ section, index }))
    .filter(({ section }) => {
      if (placement === undefined) return true
      return placement === "top" ? isHoisted(section) : !isHoisted(section)
    })

  if (visible.length === 0) return null

  return (
    <div className="rp-site-sections">
      {visible.map(({ section, index }) => (
        <SectionBand
          key={section.id ?? `${section.type}-${index}`}
          section={section}
          tinted={index % 2 === 1}
          hasContent={hasContent(section)}>
          {renderBody(section)}
        </SectionBand>
      ))}
    </div>
  )
}
