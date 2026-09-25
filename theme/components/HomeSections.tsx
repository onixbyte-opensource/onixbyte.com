import { useFrontmatter } from "@rspress/core/runtime"
import { SectionBand } from "./sections/SectionBand"
import { FeatureGrid } from "./sections/FeatureGrid"
import { TechStack } from "./sections/TechStack"
import { Cases } from "./sections/Cases"
import { CallToAction } from "./sections/CallToAction"
import { hasContent, type Section } from "./sections/types"

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

/**
 * Renders `frontmatter.sections` in declaration order.
 *
 * Attached to the `Layout` `afterHero` (home) and `afterDoc` (products,
 * services) slots. Returns `null` for any page without a `sections` array, so
 * it is inert on blog posts, project pages and every other doc page.
 */
export function HomeSections() {
  const { frontmatter } = useFrontmatter()
  const raw = frontmatter?.sections
  if (!Array.isArray(raw)) return null

  const sections = raw.filter(isSection)
  if (sections.length === 0) return null

  return (
    <div className="rp-site-sections">
      {sections.map((section, index) => (
        <SectionBand
          key={section.id ?? `${section.type}-${index}`}
          section={section}
          hasContent={hasContent(section)}>
          {renderBody(section)}
        </SectionBand>
      ))}
    </div>
  )
}
