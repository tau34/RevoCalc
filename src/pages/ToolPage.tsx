import { useParams } from "react-router-dom"
import type { ToolDefinition } from "../types/Types"

export function ToolPage({tools: tools}: {
  tools: ToolDefinition[]
}) {
  const { toolId } = useParams();
  const tool = tools.find((t) => t.id === toolId);

  if (!tool) return <div>Tool not found</div>

  const Component = tool.component

  return (
    <div>
      <h1>{tool.name}</h1>
      <Component />
    </div>
  )
}