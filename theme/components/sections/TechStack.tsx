import { arr, str, type TechStackGroup, type TechStackItem } from "./types"

/**
 * Technology matrix: named groups of technologies, each with an optional
 * emoji/icon and link.
 *
 * TODO(copy): populate `frontmatter.sections` with real entries. Groups with no
 * items are skipped, so a half-filled list still renders sensibly.
 */
export function TechStack({ groups }: { groups?: TechStackGroup[] }) {
  const visible = (arr<TechStackGroup>(groups) ?? [])
    .map((group) => ({ group, items: arr<TechStackItem>(group?.items) ?? [] }))
    .filter(({ items }) => items.length > 0)

  if (visible.length === 0) return null

  return (
    <div className="flex flex-col gap-10">
      {visible.map(({ group, items }, groupIndex) => (
        <div key={str(group.name) ?? `group-${groupIndex}`}>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-(--rp-c-text-3)">
            {str(group.name) ?? ""}
          </h3>
          <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 md:grid-cols-4">
            {items.map((item, itemIndex) => {
              const name = str(item?.name)
              if (!name) return null
              const url = str(item?.url)
              const icon = str(item?.icon)
              const body = (
                <span className="flex items-center gap-2">
                  {icon && <span aria-hidden="true">{icon}</span>}
                  <span>{name}</span>
                </span>
              )
              return (
                <li key={`${name}-${itemIndex}`} className="m-0">
                  {url ? (
                    <a
                      className="rp-link flex items-center rounded-md border border-(--rp-c-divider-light) px-3 py-2 no-underline transition-colors hover:bg-(--rp-c-bg-mute)"
                      href={url}>
                      {body}
                    </a>
                  ) : (
                    <span className="flex items-center rounded-md border border-(--rp-c-divider-light) px-3 py-2">
                      {body}
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}
