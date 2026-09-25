import { useCallback, useEffect, useState } from "react"
import { arr, str, type CaseStudy } from "./types"

const ROTATE_MS = 8000

/**
 * Customer case-study carousel.
 *
 * TODO(copy): populate `frontmatter.sections` with real case studies. With no
 * items this renders nothing; with exactly one it degrades to a static card.
 *
 * Rotation is suspended when the visitor prefers reduced motion, and pauses
 * while the carousel is hovered or focused.
 */
export function Cases({ items }: { items?: CaseStudy[] }) {
  const studies = (arr<CaseStudy>(items) ?? []).filter((item) => str(item?.company))
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const count = studies.length
  const go = useCallback(
    (next: number) => setActive(count > 0 ? ((next % count) + count) % count : 0),
    [count]
  )

  useEffect(() => {
    if (count <= 1 || paused) return
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return
    }
    const timer = window.setInterval(() => setActive((current) => (current + 1) % count), ROTATE_MS)
    return () => window.clearInterval(timer)
  }, [count, paused])

  if (count === 0) return null

  const current = studies[Math.min(active, count - 1)]
  const company = str(current.company) ?? ""
  const quote = str(current.quote)
  const details = str(current.details)
  const author = str(current.author)
  const role = str(current.role)
  const link = str(current.link)
  const logo = str(current.logo)

  return (
    <div
      className="rounded-xl border border-(--rp-c-divider-light) bg-(--rp-c-bg-soft) p-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}>
      <figure className="m-0 flex flex-col items-center gap-6 text-center">
        {logo && <img src={logo} alt={company} height={40} className="h-10 w-auto" />}
        {quote && (
          <blockquote className="m-0 max-w-3xl text-lg leading-relaxed text-(--rp-c-text-1)">
            {quote}
          </blockquote>
        )}
        {/* Without an approved testimonial, describe the engagement instead. */}
        {!quote && details && (
          <p className="m-0 max-w-2xl text-base leading-relaxed text-(--rp-c-text-1)">{details}</p>
        )}
        <figcaption className="text-sm text-(--rp-c-text-2)">
          {author && <span className="font-medium text-(--rp-c-text-1)">{author}</span>}
          {author && role && <span> · </span>}
          {role}
          {link ? (
            <>
              {" · "}
              <a className="rp-link" href={link}>
                {company}
              </a>
            </>
          ) : (
            company && <span> · {company}</span>
          )}
        </figcaption>
      </figure>

      {count > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {studies.map((study, index) => (
            <button
              key={`${str(study.company)}-${index}`}
              type="button"
              aria-label={str(study.company)}
              aria-current={index === active}
              onClick={() => go(index)}
              className={`h-2 w-2 cursor-pointer rounded-full border-0 p-0 transition-colors ${
                index === active ? "bg-(--rp-c-brand)" : "bg-(--rp-c-divider)"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
