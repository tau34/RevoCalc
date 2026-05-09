import { useState } from "react";
import BigDoubleInput from "../../components/BigDoubleInput";
import { BigDouble } from "../../types/BigDouble";
import { localize, useLocale, type LocalizedText } from "../../i18n";

const NAMES : LocalizedText[] = [
  { ja: "クリスタルミラー", en: "Crystal Mirror" },
  { ja: "魔法の頭蓋骨", en: "Magical Skull" },
  { ja: "繁栄エンジン", en: "Prosperity Engine" },
  { ja: "感情の器", en: "Emotional Vessel" }
];

const PARTS : LocalizedText[][] = [
  [
    { ja: "ガラス表面", en: "Glass Surface" },
    { ja: "銀の裏面", en: "Silver Backing" },
    { ja: "黒曜石フレーム", en: "Obsidian Frame" },
    { ja: "焦点", en: "Facial Point" },
    { ja: "光屈折装置", en: "Light Refractors" },
    { ja: "真実の面", en: "Truth Facets" },
    { ja: "記憶の結晶", en: "Memory Crystal" },
    { ja: "知覚レンズ", en: "Perception Lens" }
  ],
  [
    { ja: "枝", en: "Ramus" },
    { ja: "下顎骨", en: "Mandible" },
    { ja: "歯", en: "Teeth" },
    { ja: "上顎骨", en: "Maxilla" },
    { ja: "鼻骨", en: "Nasal Bone" },
    { ja: "眼窩下部", en: "Infraorbitals" },
    { ja: "頬骨", en: "Zygomatics" },
    { ja: "前頭骨", en: "Frontal Bone" },
    { ja: "頭頂骨", en: "Parietal Bone" },
    { ja: "側頭骨", en: "Temporal Bone" },
    { ja: "後頭骨", en: "Occipital Bone" }
  ],
  [
    { ja: "豊穣ギア", en: "Abundance Gears" },
    { ja: "顕現ピストン", en: "Manifestation Pistons" },
    { ja: "運命ギア", en: "Fortune Cogs" },
    { ja: "安定基盤", en: "Stability Foundation" },
    { ja: "成長チャンバー", en: "Growth Chambers" },
    { ja: "富循環システム", en: "Wealth Circulation System" },
    { ja: "価値評価装置", en: "Value Assessors" },
    { ja: "遺産エンコーダ", en: "Legacy Encoders" },
    { ja: "現実アンカー", en: "Reality Anchors" }
  ],
  [
    { ja: "ハートチャンバー", en: "Heart Chamber" },
    { ja: "共感バルブ", en: "Empathy Valves" },
    { ja: "悲しみフィルター", en: "Sorrow Filters" },
    { ja: "喜びのリザーバー", en: "Joy Reservoir" },
    { ja: "記憶液", en: "Memory Liquid" },
    { ja: "接続バンドル", en: "Connection Handles" },
    { ja: "真正性グレーズ", en: "Authenticity Glaze" },
    { ja: "内なる反射面", en: "Inner Reflection Surface" },
    { ja: "脆弱性開口", en: "Vulnerability Aperture" },
    { ja: "トラウマ錬金装置", en: "Trauma Alchemizer" }
  ]
];

const DESC : LocalizedText[] = [
  {
    ja: "サクリファイスダスト獲得量をx{value}倍にする",
    en: "Multiplies Sacrifice Dust gain by x{value}"
  },
  {
    ja: "遺物{no}の効果：x{value}",
    en: "Relic {no} effect: x{value}"
  },
  {
    ja: "研磨槍の効果：^{value}",
    en: "Polish Spear effect: ^{value}"
  },
  {
    ja: "全元素の要因3：^{value}",
    en: "Factor 3 for all elements: ^{value}"
  },
  {
    ja: "法王チャレンジ効果：x{value}",
    en: "The Hierophant Challenge effect: x{value}"
  },
  {
    ja: "精錬ノード7の効果：x{value}",
    en: "Refine Node 7 effect: x{value}"
  },
  {
    ja: "黄色の宝石の基本効果：x{value}",
    en: "Yellow Gem base effect: x{value}"
  },
  {
    ja: "{suit}LOGPOW基礎値：{value}",
    en: "{suit} LOGPOW base: {value}"
  },
  {
    ja: "土2ノードが^{value}に引き上げられる",
    en: "Earth 2 Node is raised to ^{value}"
  },
  {
    ja: "すべての研磨強化効果：x{value}",
    en: "All Polishing Enhancement effects: x{value}"
  },
  {
    ja: "隠者の基本効果：x{value}",
    en: "The Hermit base effect: x{value}"
  },
  {
    ja: "水品質係数を^{value}に引き上げる",
    en: "Raises Water Quality Factor to ^{value}"
  }
]

const RESOURCES: LocalizedText[] = [
  { ja: "ソード", en: "Swords" },
  { ja: "ワンド", en: "Wands" },
  { ja: "ペンタクル", en: "Pentacles" },
  { ja: "カップ", en: "Cups" }
];

const PART : LocalizedText = { ja: "パーツ {part}", en: "Part {part}" };
const LEVEL : LocalizedText = { ja: "レベル", en: "Level" };
const UNLOCK : LocalizedText = { ja: "解放", en: "Unlock" };
const COST : LocalizedText = { ja: "コスト", en: "Cost" };
const EFFECT : LocalizedText = { ja: "効果", en: "Effect" };
const COMING_SOON : LocalizedText = { ja: "近日公開...", en: "Coming Soon..." };

const partsCount = PARTS.map(p => p.length);

const Artifact = () => {
  const [CM, setCM] = useState(0);
  const [MS, setMS] = useState(0);
  const [PE, setPE] = useState(0);
  const [EV, setEV] = useState(0);
  const [parts, setParts] = [
    [CM, MS, PE, EV],
    [setCM, setMS, setPE, setEV]
  ];
  const [type, setType] = useState(0);
  const [level, setLevel] = useState(BigDouble.ONE);
  const [f, setF] = useState(true);

  const locale = useLocale();
  const part = parts[type];
  const narrow = document.documentElement.clientWidth < 420;

  const shift = (delta: number) => {
    const newType = (type + delta + 4) % 4;
    setType(newType);
  }

  const shiftPart = (delta: number) => {
    const newPart = (part + delta + partsCount[type]) % partsCount[type];
    setParts[type](newPart);
  }

  const calcCost = () => {
    if (level.equals(BigDouble.ONE)) {
      switch (part) {
        case 0: return BigDouble.fromNumber(1);
        case 1: return BigDouble.fromNumber(10);
        case 2: return BigDouble.fromNumber(20);
        case 3: return BigDouble.fromNumber(100);
        case 4: return BigDouble.fromNumber(500);
        case 5: return BigDouble.fromNumber(2500);
        case 6:
          switch (type) {
            case 0: return BigDouble.fromNumber(50000);
            case 1: return BigDouble.fromNumber(18000);
            case 2: return BigDouble.fromNumber(30000);
            case 3: return BigDouble.fromNumber(25000);
          }
          break;
        case 7:
          switch (type) {
            case 0: return BigDouble.fromNumber(1000000);
            case 1: return BigDouble.fromNumber(45000);
            case 2: return BigDouble.fromNumber(200000);
            case 3: return BigDouble.fromNumber(90000);
          }
          break;
        case 8:
          switch (type) {
            case 1: return BigDouble.fromNumber(120000);
            case 2: return BigDouble.fromNumber(1250000);
            case 3: return BigDouble.fromNumber(400000);
          }
          break;
        case 9:
          switch (type) {
            case 1: return BigDouble.fromNumber(600000);
            case 3: return BigDouble.fromNumber(1500000);
          }
          break;
        case 10:
          switch (type) {
            case 1: return BigDouble.fromNumber(1800000);
          }
          break;
      }
      return new BigDouble(1, 100);
    }
    let m = new BigDouble(1, 100);
    switch (part) {
      case 0: m = BigDouble.fromNumber(5); break;
      case 1: m = BigDouble.fromNumber(20); break;
      case 2: m = BigDouble.fromNumber(80); break;
      case 3: m = BigDouble.fromNumber(400); break;
      case 4: m = BigDouble.fromNumber(1600); break;
      case 5: m = BigDouble.fromNumber(8000); break;
      case 6:
        switch (type) {
          case 0: m = BigDouble.fromNumber(180000); break;
          case 1: m = BigDouble.fromNumber(60000); break;
          case 2: m = BigDouble.fromNumber(1250000); break;
          case 3: m = BigDouble.fromNumber(75000); break;
        }
        break;
      case 7:
        switch (type) {
          case 0: m = BigDouble.fromNumber(5000000); break;
          case 1: m = BigDouble.fromNumber(150000); break;
          case 2: m = BigDouble.fromNumber(800000); break;
          case 3: m = BigDouble.fromNumber(300000); break;
        }
        break;
      case 8:
        switch (type) {
          case 1: m = BigDouble.fromNumber(450000); break;
          case 2: m = BigDouble.fromNumber(5000000); break;
          case 3: m = BigDouble.fromNumber(1500000); break;
        }
        break;
      case 9:
        switch (type) {
          case 1: m = BigDouble.fromNumber(3000000); break;
          case 3: m = BigDouble.fromNumber(6700000); break;
        }
        break;
      case 10:
        switch (type) {
          case 1: m = BigDouble.fromNumber(8000000); break;
        }
        break;
    }

    let l = level.sub(1);
    if (l.greaterThanEqual(3)) {
      l = l.pow(l.mul(0.01).add(1));
    }

    return m.mul(BigDouble.fromNumber(2).pow(l));
  }

  const calcEff = () => {
    let d = localize(COMING_SOON, locale);
    let value = "";
    switch (part) {
      case 0:
        value = BigDouble.fromNumber(10000).pow(level).toString();
        d = localize(DESC[0], locale, { value });
        break;
      case 1:
        value = level.mul(0.01).add(1).toString();
        d = localize(DESC[1], locale, { value, no: `${type + 24}` });
        break;
      case 2:
        switch (type) {
          case 0:
            value = level.mul(0.01).add(1).toString();
            d = localize(DESC[1], locale, { value, no: "56" });
            break;
          case 1:
            value = level.mul(1000).add(1).toString();
            d = localize(DESC[1], locale, { value, no: "8" });
            break;
          case 2:
            value = level.mul(0.02).add(1).toString();
            d = localize(DESC[2], locale, { value });
            break;
          case 3:
            value = level.mul(0.02).add(1).toString();
            d = localize(DESC[3], locale, { value });
            break;
        }
        break;
      case 3:
        switch (type) {
          case 0:
            value = level.mul(0.25).add(1).toString();
            d = localize(DESC[1], locale, { value, no: "13" });
            break;
          case 1:
            value = level.mul(0.1).add(1).toString();
            d = localize(DESC[1], locale, { value, no: "14" });
            break;
          case 2:
            value = level.mul(0.01).add(1).toString();
            d = localize(DESC[4], locale, { value });
            break;
          case 3:
            value = BigDouble.fromNumber(100).pow(level.greaterThan(2) ? level.div(2).pow(0.5).mul(2) : level)
              .div(100).pow(0.04).mul(100).toString();
            d = localize(DESC[1], locale, { value, no: "2" });
            break;
        }
        break;
      case 4:
        value = level.mul(0.25).add(1).toString();
        d = localize(DESC[1], locale, { value, no: "2" });
        break;
      case 5:
        switch (type) {
          case 0:
            value = level.mul(0.01).add(1).toString();
            d = localize(DESC[1], locale, { value, no: "21" });
            break;
          case 1:
            value = level.mul(0.01).add(1).toString();
            d = localize(DESC[5], locale, { value });
            break;
          case 2:
            value = level.mul(0.01).add(1).toString();
            d = localize(DESC[6], locale, { value });
            break;
          case 3:
            value = level.mul(0.01).add(1).toString();
            d = localize(DESC[2], locale, { value });
            break;
        }
        break;
      case 6:
        value = level.mul(0.09).add(1).toString();
        d = localize(DESC[7], locale, { value, suit: localize(RESOURCES[type], locale) });
        break;
      case 7:
        switch (type) {
          case 1:
            value = level.mul(0.02).add(1).toString();
            d = localize(DESC[1], locale, { value, no: "52" });
            break;
          case 2:
            value = level.mul(4).add(1).toString();
            d = localize(DESC[8], locale, { value });
            break;
          case 3:
            value = level.mul(0.025).add(1).toString();
            d = localize(DESC[9], locale, { value });
            break;
        }
        break;
      case 8:
        switch (type) {
          case 1:
            value = level.mul(0.05).add(1).toString();
            d = localize(DESC[10], locale, { value });
            break;
          case 3:
            value = level.mul(0.02).add(1).toString();
            d = localize(DESC[1], locale, { value, no: "32" });
            break;
        }
        break;
      case 9:
        switch (type) {
          case 1:
            value = level.mul(0.5).add(1).toString();
            d = localize(DESC[11], locale, { value });
            break;
        }
        break;
    }
    return d;
  }

  document.body.onresize = () => setF(!f);

  return (
    <div>
      <h2 style={{ margin: "20px 0" }}>
        {!narrow && <button className="normal-button" 
          onClick={() => shift(-1)} disabled={type === 0}>←</button>}
        {localize(NAMES[type], locale)}
        {!narrow && <button className="normal-button" 
          onClick={() => shift(1)} disabled={type === 3}>→</button>}
        <h3>({localize(RESOURCES[type], locale)})</h3>
      </h2>
      {narrow && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 70 }}>
          <button className="normal-button" style={{ position: "absolute", left: 10 }}
            onClick={() => shift(-1)} disabled={type === 0}>←</button>
          <button className="normal-button" style={{ position: "absolute", right: 10 }}
            onClick={() => shift(1)} disabled={type === 3}>→</button>
        </div>
      )}
      <h3>
        {localize(PART, locale, { part: (part + 1).toString() })}
        <br />
        {!narrow && <button className="normal-button" 
          onClick={() => shiftPart(-1)} disabled={part === 0}>←</button>}
        {localize(PARTS[type][part], locale)}
        {!narrow && <button className="normal-button" 
          onClick={() => shiftPart(1)} disabled={part === partsCount[type] - 1}>→</button>}
      </h3>
      {narrow && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 70 }}>
          <button className="normal-button" style={{ position: "absolute", left: 10 }}
            onClick={() => shiftPart(-1)} disabled={part === 0}>←</button>
          <button className="normal-button" style={{ position: "absolute", right: 10 }}
            onClick={() => shiftPart(1)} disabled={part === partsCount[type] - 1}>→</button>
        </div>
      )}
      <div style={{ marginBottom: 30 }}></div>
      <BigDoubleInput
        label={localize(LEVEL, locale) + ": "}
        value={BigDouble.ONE}
        onChange={(v) => setLevel(v)}
        isValid={(val) => val.greaterThan(BigDouble.ZERO) &&
          val.isInteger()}
      />
      <div style={{ marginTop: 10 }}>
        {
          (level.equals(BigDouble.ONE) ? localize(UNLOCK, locale) : 
          `${localize(LEVEL, locale)} ${level.sub(1).toString()}→${level.toString()}`)
          + " " + localize(COST, locale) + ": " + calcCost().toString()
        }
      </div>
      <div>
        {localize(EFFECT, locale)}: {calcEff()}
      </div>
    </div>
  )
}

export default Artifact;