import type { ReactNode } from "react"
import { SHOW_COPY_PLACEHOLDERS } from "./placeholder"
import { str, type Section } from "./types"

interface SectionBandProps {
  section: Section
  /** Whether the section body produced any content. */
  hasContent: boolean
  children: ReactNode
}

/**
 * Shell for a marketing band: the `<section>` wrapper, its heading and its
 * subtitle. Renders nothing at all when the section has neither content nor a
 * heading, so an unfilled page degrades to just its hero.
 */
export function SectionBand({ section, hasContent, children }: SectionBandProps) {
  const title = str(section.title)
  const subtitle = str(section.subtitle)

  if (!hasContent && !title && !subtitle) {
    if (!SHOW_COPY_PLACEHOLDERS) return null
    return (
      <section id={section.id} className="rp-site-section">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-lg border border-dashed border-(--rp-c-divider) p-8 text-center text-sm text-(--rp-c-text-3)">
            TODO: {section.type}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id={section.id} className="rp-site-section">
      <div className="mx-auto max-w-5xl px-6">
        {(title || subtitle) && (
          <header className="mb-10 text-center">
            {title && <h2 className="m-0 text-3xl font-semibold text-(--rp-c-text-1)">{title}</h2>}
            {subtitle && (
              <p className="mx-auto mt-3 max-w-2xl text-base text-(--rp-c-text-2)">{subtitle}</p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  )
}
