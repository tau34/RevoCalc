import Artifact from "../pages/tools/Artifact";
import LuckCalc from "../pages/tools/LuckCalc";
import TarotUpgrade from "../pages/tools/TarotUpgrade";
import type { ToolDefinition } from "./Types";

const LuckCalcTool: ToolDefinition = {
  id: "luck",
  name: {
    ja: "運計算機",
    en: "Luck Calculator"
  },
  description: {
    ja: "運の値から星座のレアリティの出現確率を計算します",
    en: "Calculate chances of zodiac rarities from your luck"
  },
  component: LuckCalc
}

const TarotUpgradeTool: ToolDefinition = {
  id: "tarot-upgrade",
  name: {
    ja: "タロットアップグレード計算機",
    en: "Tarot Upgrade Calculator"
  },
  description: {
    ja: "タロットアップグレードのコストと効果を計算します",
    en: "Calculate tarot upgrade cost and effect"
  },
  component: TarotUpgrade
}

const ArtifactTool: ToolDefinition = {
  id: "artifact",
  name: {
    ja: "アーティファクト計算機",
    en: "Artifact Calculator"
  },
  description: {
    ja: "アーティファクトのコストと効果を計算します",
    en: "Calculate artifact costs and effects"
  },
  component: Artifact
}

export const TOOLS : ToolDefinition[] = [
  LuckCalcTool,
  TarotUpgradeTool,
  ArtifactTool
]
