import LuckCalc from "../pages/tools/LuckCalc";
import TarotUpgrade from "../pages/tools/TarotUpgrade";
import type { ToolDefinition } from "./Types";

const LuckCalcTool: ToolDefinition = {
  id: "luck",
  name: "Luck Calculator",
  description: "calculate chances of zodiacs from your luck",
  component: LuckCalc
}

const TarotUpgradeTool: ToolDefinition = {
  id: "tarot-upgrade",
  name: "Tarot Upgrade Simulator",
  description: "calculate tarot upgrade cost and effect",
  component: TarotUpgrade
}

export const TOOLS : ToolDefinition[] = [
  LuckCalcTool,
  TarotUpgradeTool
]
