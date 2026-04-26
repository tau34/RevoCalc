import { useParams } from "react-router-dom"
import type { ToolDefinition } from "../types/Types"
import { localize, useLocale } from "../i18n"

export function ToolPage({tools: tools}: {
  tools: ToolDefinition[]
}) {
  const { toolId } = useParams();
  const locale = useLocale();
  const tool = tools.find((t) => t.id === toolId);

  if (!tool) return <div>{locale === "ja" ? "ツールが見つかりません" : "Tool not found"}</div>

  const Component = tool.component

  return (
    <div>
      <h1>{localize(tool.name, locale)}</h1>
      <Component />
    </div>
  )
}