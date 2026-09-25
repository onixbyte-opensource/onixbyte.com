import { Button } from "@rspress/core/theme-original"
import { arr, str, type CallToActionLink, type ContactCode } from "./types"

/**
 * Closing call-to-action band: one or more buttons, optionally alongside a
 * scannable contact code (a WeChat QR, for instance).
 *
 * `Button` renders its own `<a>` (routed through the theme's `Link`), so it
 * must be given `href` directly rather than being wrapped in an anchor.
 */
export function CallToAction({
  actions,
  code,
}: {
  actions?: CallToActionLink[]
  code?: ContactCode
}) {
  const links = (arr<CallToActionLink>(actions) ?? []).filter(
    (action) => str(action?.text) && str(action?.link)
  )
  const codeSrc = str(code?.src)
  const codeCaption = str(code?.caption)

  if (links.length === 0 && !codeSrc) return null

  return (
    <div className="flex flex-col items-center gap-8">
      {links.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4">
          {links.map((action, index) => (
            <Button
              key={`${str(action.text)}-${index}`}
              type="a"
              theme={action.theme === "alt" ? "alt" : "brand"}
              href={str(action.link) as string}
              // `.rp-button--big` sets a min-width but no horizontal padding, so
              // a long label such as an email address runs into the rounded
              // edges. Supply the padding ourselves.
              className="px-10">
              {str(action.text)}
            </Button>
          ))}
        </div>
      )}

      {codeSrc && (
        <figure className="m-0 flex flex-col items-center gap-3">
          {/* The white frame is not decoration. A QR code needs a quiet zone of
              blank space around it to scan reliably, and the exported image has
              almost none — the pattern runs close to its edges. */}
          <div className="rounded-xl border border-(--rp-c-divider-light) bg-white p-4">
            <img
              src={codeSrc}
              alt={codeCaption ?? ""}
              width={160}
              height={160}
              className="block h-40 w-40"
            />
          </div>
          {codeCaption && (
            <figcaption className="text-sm text-(--rp-c-text-2)">{codeCaption}</figcaption>
          )}
        </figure>
      )}
    </div>
  )
}
