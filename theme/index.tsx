import "./index.css"
import type { DocLayoutProps } from "@rspress/core/theme-original"
import { DocLayout as OriginalDocLayout } from "@rspress/core/theme-original"
import { Tags } from "./components/Tags"
import { Author } from "./components/Author"

function DocLayout(props: DocLayoutProps) {
  return (
    <OriginalDocLayout
      {...props}
      beforeOutline={
        <>
          <Author className="ml-4 md:ml-0" />
          {props.beforeOutline}
        </>
      }
      afterDocContent={
        <>
          {props.afterDocContent}
          <Tags />
        </>
      }
    />
  )
}

export * from "@rspress/core/theme-original"
export { DocLayout }
