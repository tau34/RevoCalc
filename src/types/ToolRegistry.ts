import Artifact from "../pages/tools/Artifact";
import GoldenResource from "../pages/tools/GoldenResource";
import LuckCalc from "../pages/tools/LuckCalc";
import TarotUpgrade from "../pages/tools/TarotUpgrade";
import TF from "../pages/tools/TF";
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

const GoldenResourceTool: ToolDefinition = {
  id: "golden-resource",
  name: {
    ja: "金資源計算機",
    en: "Golden Resource Calculator"
  },
  description: {
    ja: "タロット資源から金資源の獲得量を計算します",
    en: "Calculate golden resource gain from tarot resource"
  },
  component: GoldenResource
}

const TFTool: ToolDefinition = {
  id: "tf",
  name: {
    ja: "TF計算機",
    en: "TF Calculator"
  },
  description: {
    ja: "TF、OFの取得量や容量、アップグレードのコストを計算します",
    en: "Calculate TF/OF gain, capacity and upgrade costs"
  },
  component: TF
}

export const TOOLS : ToolDefinition[] = [
  TFTool,
  LuckCalcTool,
  TarotUpgradeTool,
  ArtifactTool,
  GoldenResourceTool
]
