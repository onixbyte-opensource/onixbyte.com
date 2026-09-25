import type { Feature } from "@rspress/core"

/**
 * Shape of a `frontmatter.sections` entry.
 *
 * `FrontMatterMeta` ends with an index signature so `sections` is accepted, but
 * frontmatter is parsed at runtime by gray-matter and takes no part in MDX type
 * checking — every field must therefore be defended at the point of use.
 */

export interface TechStackItem {
  name: string
  icon?: string
  url?: string
}

export interface TechStackGroup {
  name: string
  items?: TechStackItem[]
}

export interface CaseStudy {
  company: string
  logo?: string
  /** A client testimonial. Only use one the client has actually approved. */
  quote?: string
  author?: string
  role?: string
  link?: string
  /**
   * What the engagement was. Rendered instead of `quote` when there is no
   * approved testimonial — far better than showing a bare company name.
   */
  details?: string
}

export interface CallToActionLink {
  theme?: "brand" | "alt"
  text: string
  link: string
}

/** A scannable code, such as a WeChat contact QR. `src` is a public asset path. */
export interface ContactCode {
  src: string
  caption?: string
}

interface SectionBase {
  id?: string
  title?: string
  subtitle?: string
  /**
   * Where the band sits relative to the article body. `"top"` hoists it above
   * the body, directly under the page title; `"bottom"` — the default — leaves
   * it below the article.
   *
   * Only doc pages can honour this, because only they have an article to sit
   * between. The home page renders every band below the features grid, in
   * declaration order, whatever this says.
   */
  placement?: "top" | "bottom"
}

export type Section =
  | (SectionBase & { type: "advantages"; items?: Feature[] })
  | (SectionBase & { type: "contentGrid"; items?: Feature[] })
  | (SectionBase & { type: "techStack"; groups?: TechStackGroup[] })
  | (SectionBase & { type: "cases"; items?: CaseStudy[] })
  | (SectionBase & {
      type: "cta"
      actions?: CallToActionLink[]
      code?: ContactCode
    })

export type SectionType = Section["type"]

/** Returns a trimmed string, or `undefined` when the value is missing or blank. */
export function str(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined
}

/** Returns a non-empty array, or `undefined`. */
export function arr<T>(value: unknown): T[] | undefined {
  return Array.isArray(value) && value.length > 0 ? (value as T[]) : undefined
}

/**
 * Whether a section would render any body content.
 *
 * Shared by the renderers (which return `null` when empty) and by
 * `SectionBand`, so the two can never disagree about whether a band is empty.
 */
export function hasContent(section: Section): boolean {
  switch (section.type) {
    case "advantages":
    case "contentGrid":
      return arr<Feature>(section.items) !== undefined
    case "techStack":
      return (
        arr<TechStackGroup>(section.groups)?.some(
          (group) => arr<TechStackItem>(group?.items) !== undefined
        ) ?? false
      )
    case "cases":
      return arr<CaseStudy>(section.items) !== undefined
    case "cta":
      return (
        arr<CallToActionLink>(section.actions) !== undefined || str(section.code?.src) !== undefined
      )
  }
}

/** Whether a section asked to be hoisted above the article body. */
export function isHoisted(section: Section): boolean {
  return section.placement === "top"
}
