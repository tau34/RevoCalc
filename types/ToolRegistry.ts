import LuckCalc from "../pages/tools/LuckCalc";
import type { ToolDefinition } from "./Types";

const LuckCalcTool: ToolDefinition = {
  id: "luck",
  name: "Luck Calculator",
  description: "calculate chances of zodiacs from your luck",
  component: LuckCalc
}

export const TOOLS : ToolDefinition[] = [
  LuckCalcTool
]
