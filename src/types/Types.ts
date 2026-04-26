import type { LocalizedText } from "../i18n"

export type ToolDefinition = {
  id: string
  name: LocalizedText
  description: LocalizedText
  component: React.ComponentType
}
