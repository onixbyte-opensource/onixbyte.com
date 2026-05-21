import { useFrontmatter } from "@rspress/core/runtime"

export function Tags() {
  const { frontmatter } = useFrontmatter()
  const tags: string[] | undefined = frontmatter?.tags as string[]
  if (!tags?.length) return null
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-block px-2.5 py-0.5 text-xs leading-relaxed rounded
                     text-(--rp-c-brand) bg-(--rp-c-brand-tint)
                     whitespace-nowrap">
          {tag}
        </span>
      ))}
    </div>
  )
}
