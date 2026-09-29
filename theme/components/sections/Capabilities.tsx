import { arr, str, type Capability } from "./types"

/**
 * Direction cards: the kinds of project we take on.
 *
 * The buying question is "what can you build for me", not "what do you build
 * with", so each card names a project category and the concrete deliverables
 * under it. The fill comes from `rp-capability-card` in `index.css` rather than
 * a `bg-` utility, because the band alternates between the page background and
 * `--rp-c-bg-soft` and the card has to invert against whichever it lands on.
 */
export function Capabilities({ items }: { items?: Capability[] }) {
  const cards = (arr<Capability>(items) ?? [])
    .map((item) => ({
      title: str(item?.title) ?? "",
      details: str(item?.details),
      icon: str(item?.icon),
      // `arr<string>` is an assertion, not a guarantee — frontmatter is parsed by
      // gray-matter at runtime and takes no part in MDX type checking, so each
      // entry still goes through `str` before it reaches the DOM.
      entries: (arr<string>(item?.subItems) ?? []).map((entry) => str(entry)),
    }))
    .filter((card) => card.title !== "")

  if (cards.length === 0) return null

  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-3">
      {cards.map(({ title, details, icon, entries }, index) => (
        <li
          key={`${title}-${index}`}
          className="rp-capability-card flex flex-col rounded-xl border border-(--rp-c-divider-light) p-6">
          {icon && (
            <span aria-hidden="true" className="text-2xl">
              {icon}
            </span>
          )}
          <h3 className="mt-3 mb-0 text-lg font-semibold text-(--rp-c-text-1)">{title}</h3>
          {details && (
            <p className="mt-2 mb-0 text-sm leading-relaxed text-(--rp-c-text-2)">{details}</p>
          )}
          {entries.length > 0 && (
            <ul className="mt-4 mb-0 list-disc pl-5 text-sm leading-relaxed text-(--rp-c-text-2)">
              {entries.map((entry, entryIndex) =>
                entry ? (
                  <li key={`${entry}-${entryIndex}`} className="m-0">
                    {entry}
                  </li>
                ) : null
              )}
            </ul>
          )}
        </li>
      ))}
    </ul>
  )
}
