import type { HTMLAttributes } from "react"

const macOSSymbols: Record<string, string> = {
  cmd: "⌘",
  command: "⌘",
  opt: "⌥",
  option: "⌥",
  alt: "⌥",
  ctrl: "⌃",
  control: "⌃",
  shift: "⇧",
  enter: "↩",
  return: "↩",
  tab: "⇥",
  esc: "⎋",
  escape: "⎋",
  delete: "⌫",
  backspace: "⌫",
  forwardDelete: "⌦",
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
  space: "␣",
  fn: "Fn",
  globe: "🌐",
  eject: "⏏",
  power: "⏻",
  capslock: "⇪",
  home: "↖",
  end: "↘",
  pageup: "⇞",
  pagedown: "⇟",
  clear: "⌧",
}

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  mac?: keyof typeof macOSSymbols
}

export function Kbd({ children, mac, className = "", ...rest }: KbdProps) {
  const label = children ?? (mac ? macOSSymbols[mac] : null)
  if (!label) return null

  return (
    <kbd
      className={`inline-flex items-center justify-center min-w-[1.6em] px-1.5 py-0
        text-[0.85em] leading-normal font-mono
        rounded-md border border-b-2
        border-gray-300 dark:border-gray-600
        bg-gray-50 dark:bg-gray-800
        text-gray-700 dark:text-gray-300
        shadow-[0_1px_1px_rgba(0,0,0,0.075)]
        align-baseline
        ${className}`.replace(/\s+/g, " ")}
      {...rest}>
      {label}
    </kbd>
  )
}
