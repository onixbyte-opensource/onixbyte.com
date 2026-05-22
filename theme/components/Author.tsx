import { useFrontmatter } from "@rspress/core/runtime"

// MD5 — self-contained, works in any JS environment
function md5Hex(message: string): string {
  const S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9,
    14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ]

  const T: number[] = []
  for (let i = 0; i < 64; i++) {
    T[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000) | 0
  }

  const bytes: number[] = []
  for (let i = 0; i < message.length; i++) {
    const c = message.charCodeAt(i)
    if (c < 0x80) bytes.push(c)
    else if (c < 0x800) {
      bytes.push(0xc0 | (c >> 6))
      bytes.push(0x80 | (c & 0x3f))
    } else {
      bytes.push(0xe0 | (c >> 12))
      bytes.push(0x80 | ((c >> 6) & 0x3f))
      bytes.push(0x80 | (c & 0x3f))
    }
  }

  const bitLen = bytes.length * 8
  bytes.push(0x80)
  while ((bytes.length + 8) % 64 !== 0) bytes.push(0)
  for (let i = 0; i < 4; i++) bytes.push((bitLen >>> (i * 8)) & 0xff)
  for (let i = 0; i < 4; i++) bytes.push(0)

  let a0 = 0x67452301,
    b0 = 0xefcdab89,
    c0 = 0x98badcfe,
    d0 = 0x10325476

  for (let offset = 0; offset < bytes.length; offset += 64) {
    const M = new Array(16)
    for (let i = 0; i < 16; i++) {
      M[i] =
        bytes[offset + i * 4] |
        (bytes[offset + i * 4 + 1] << 8) |
        (bytes[offset + i * 4 + 2] << 16) |
        (bytes[offset + i * 4 + 3] << 24)
    }

    let A = a0,
      B = b0,
      C = c0,
      D = d0

    for (let i = 0; i < 64; i++) {
      let F: number, g: number
      if (i < 16) {
        F = (B & C) | (~B & D)
        g = i
      } else if (i < 32) {
        F = (D & B) | (~D & C)
        g = (5 * i + 1) % 16
      } else if (i < 48) {
        F = B ^ C ^ D
        g = (3 * i + 5) % 16
      } else {
        F = C ^ (B | ~D)
        g = (7 * i) % 16
      }

      F = (F + A + T[i] + M[g]) | 0
      A = D
      D = C
      C = B
      B = (B + ((F << S[i]) | (F >>> (32 - S[i])))) | 0
    }

    a0 = (a0 + A) | 0
    b0 = (b0 + B) | 0
    c0 = (c0 + C) | 0
    d0 = (d0 + D) | 0
  }

  return [a0, b0, c0, d0]
    .map(
      (x) =>
        ((x >>> 0) & 0xff).toString(16).padStart(2, "0") +
        ((x >>> 8) & 0xff).toString(16).padStart(2, "0") +
        ((x >>> 16) & 0xff).toString(16).padStart(2, "0") +
        ((x >>> 24) & 0xff).toString(16).padStart(2, "0")
    )
    .join("")
}

function gravatarUrl(email: string, size = 80): string {
  const normalized = email.trim().toLowerCase()
  const hash = md5Hex(normalized)
  return `https://cravatar.cn/avatar/${hash}?s=${size}&d=robohash&r=g`
}

interface AuthorInfo {
  name?: string
  email?: string
}

export function Author({ className }: { className?: string }) {
  const { frontmatter } = useFrontmatter()
  const author = frontmatter?.author as AuthorInfo | undefined
  if (!author?.name?.trim()) return null

  const src = author.email?.trim() ? gravatarUrl(author.email) : null

  return (
    <a
      href={author.email?.trim() ? `mailto:${author.email}` : undefined}
      className={`flex items-center gap-2 my-6 p-1 rounded-full
                 border border-(--rp-c-divider) bg-(--rp-c-bg-soft)
                 no-underline transition-colors hover:bg-(--rp-c-bg-mute)
                 cursor-pointer select-none w-fit${className ? ` ${className}` : ""}`}>
      {src && <img src={src} alt={author.name} width={32} height={32} className="rounded-full" />}
      <span className="text-sm text-(--rp-c-text-2) pr-2">{author.name}</span>
    </a>
  )
}
