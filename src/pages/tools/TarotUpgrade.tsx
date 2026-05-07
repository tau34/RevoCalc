import { useState } from "react";
import BigDoubleInput from "../../components/BigDoubleInput";
import { BigDouble } from "../../types/BigDouble";
import { useLocale, localize, type LocalizedText } from "../../i18n";

type SUIT = "S" | "W" | "P" | "C";
const suits: SUIT[] = ["S", "W", "P", "C"];

const switchLeft = (suit: SUIT): SUIT => {
  const i = suits.indexOf(suit);
  return suits[(i - 1 + 4) % 4];
};

const switchRight = (suit: SUIT): SUIT => {
  const i = suits.indexOf(suit);
  return suits[(i + 1) % 4];
};

const TarotUpgrade = () => {
  const locale = useLocale();
  const [suit, setSuit] = useState<SUIT>("S");
  const [curSuit, setCurSuit] = useState<number | null>(null);
  const [upId, setUpId] = useState<number | null>(null);
  const [level, setLevel] = useState<BigDouble>(BigDouble.ONE);
  const [extra, setExtra] = useState<BigDouble>(BigDouble.ZERO);
  const [f, setF] = useState<boolean>(false);

  const POSITIONS = [[[183, 72], [183, 178], [183, 274], [183, 365],
  [183, 457], [183, 543], [93, 543], [273, 543], [183, 645]],
  [[108, 110], [36, 180], [36, 332], [108, 403], [183, 525], [258, 403],
  [330, 332], [330, 180], [257, 110]], [[183, 302], [183, 193],
  [88, 273], [278, 273], [122, 381], [238, 381], [88, 183], [278, 183],
  [46, 351]], [[183, 104], [183, 195], [183, 284], [183, 374],
  [183, 452], [183, 523], [183, 604], [68, 604], [298, 604]]];

  const LABELS: Record<string, LocalizedText> = {
  resourceAmount: { ja: "(タロット資源) 所持数", en: "(Tarot Resource) Amount" },
  effect: { ja: "効果", en: "Effect" },
  cost: { ja: "コスト", en: "Cost" },
  upgrade: { ja: "アップグレード", en: "Upgrade" },
  level: { ja: "レベル: ", en: "Level: " },
};

const DESC : LocalizedText[] = [
    {
      ja: "タロットのローカル速度を+{value}増加させる",
      en: "Increases Tarot Local Speed Pow by +{value}"
    },
    {
      ja: "{elem}の2番目の元素生産要素をx{value}増加",
      en: "Increases {elem} 2nd factor power by x{value}"
    },
    {
      ja: "{type}に基づいて{elem}の2番目の元素生産要素を+{value}増加",
      en: "Increases {elem} 2nd factor base based on your {type}: +{value}"
    },
    {
      ja: "前の4つのアップグレードの最大レベルを{value}増加",
      en: "Increase Max level of first 4 {type} upgrades by {value}"
    },
    {
      ja: "精錬ノード{no}の効果が^{value}に強化",
      en: "Refine Node {no}'s effect is powered to ^{value}"
    },
    {
      ja: "運を^{value}に強化",
      en: "Empowers Luck to ^{value}"
    },
    {
      ja: "遺物46のソフトキャップを{value}増加",
      en: "Increases Relic 46 softcap by {value}"
    },
    {
      ja: "ソードの2の効果にx{value}",
      en: "x{value} to Two of Swords effects"
    },
    {
      ja: "遺物41の効果が^{value}に強化",
      en: "Relic 41 effect is powered to ^{value}"
    },
    {
      ja: "サクリダスト獲得量をx{value}倍",
      en: "Multiplies Sacri Dust gain by x{value}"
    },
    {
      ja: "{type}のチャレンジスート報酬:^{value}",
      en: "Challenge Suit Reward for {type}: ^{value}"
    },
    {
      ja: "ローカルアーティファクト速度を+{value}増加",
      en: "Increase Local Artifact Speed by +{value}"
    },
    {
      ja: "{type}アップグレード5-8の最大レベルを{value}増加",
      en: "Increase Max Level of {type} upgrades 5-8 by {value}"
    }
  ];

  const getType = (s: SUIT):
    "left" | "right" | "center" | "none" => {
    const i1 = suits.indexOf(suit);
    const i2 = suits.indexOf(s);
    const diff = (i2 - i1 + 4) % 4;
    if (diff === 0) return "center";
    if (diff === 1) return "left";
    if (diff === 3) return "right";
    return "none";
  }

  const RESOURCES: LocalizedText[] = [
    { ja: "ソード", en: "Swords" },
    { ja: "ワンド", en: "Wands" },
    { ja: "ペンタクル", en: "Pentacles" },
    { ja: "カップ", en: "Cups" }
  ];

  const getResourceLabel = (s: number) => {
    return localize(RESOURCES[s] ?? RESOURCES[0], locale);
  };

  const ELEMENTS: LocalizedText[] = [
    { ja: "風", en: "Wind" },
    { ja: "火", en: "Fire" },
    { ja: "地", en: "Earth" },
    { ja: "水", en: "Water" }
  ];

  const getElementLabel = (s: number) => {
    return localize(ELEMENTS[s] ?? ELEMENTS[0], locale);
  };

  function calcCost(a: number, b: number, c: number) {
    console.log(new BigDouble(1, 10).pow(0));
    return new BigDouble(1, a).mul(new BigDouble(1, b).pow(
      level.greaterThanEqual(3) ? level.sub(1).pow(c) :
        level.sub(1))).toString();
  }

  function update(s: number, i: number) {
    let eff: string = "";
    let cost: string = "";
    let desc: string = "";

    switch (i) {
      case 0:
        eff = level.pow(0.25).mul(0.01).toString();
        desc = localize(DESC[0], locale, { value: eff });
        cost = new BigDouble(1, 6).mul(
          new BigDouble(1, 9).pow(level.sub(1))).toString();
        break;
      case 1:
        eff = level.mul(s === 3 ? 0.15 : 0.06).add(1).toString();
        desc = localize(DESC[1], locale, { value: eff, elem: getElementLabel(s) });
        cost = new BigDouble(1, 9).mul(
          new BigDouble(1, 11).pow(level.sub(1))).toString();
        break;
      case 2:
        let raw1 = level.sqrt().mul(0.1)
          .mul(extra.add(1).log10());
        if (s === 2) {
          eff = raw1.div(2).toString();
        } else if (s === 3) {
          eff = raw1.div(Math.log10(8)).toString();
        } else {
          eff = raw1.toString();
        }
        desc = localize(DESC[2], locale, { value: eff, elem: getElementLabel(s) });
        cost = new BigDouble(1, 12).mul(
          new BigDouble(1, 13).pow(level.sub(1))).toString();
        break;
      case 3:
        eff = level.toString();
        desc = localize(DESC[3], locale, { value: eff });
        cost = calcCost(15, 15, 2);
        break;
      case 4:
        switch (s) {
          case 0:
            if (level.greaterThan(0)) {
              eff = BigDouble.fromNumber(1.1).pow(level.sub(1))
                .mul(1000).toString();
            } else {
              eff = "1";
            }
            desc = localize(DESC[4], locale, { value: eff, no: "1" });
            cost = calcCost(200, 50, 1.75);
            break;
          case 1:
            if (level.greaterThan(0)) {
              eff = BigDouble.fromNumber(1.05).pow(level.sub(1))
                .mul(1000).toString();
            } else {
              eff = "1";
            }
            desc = localize(DESC[4], locale, { value: eff, no: "16" });
            cost = calcCost(210, 60, 1.8);
            break;
          case 2:
            if (level.greaterThan(0)) {
              eff = level.sub(1).mul(0.1).add(1.4).toString();
            } else {
              eff = "1";
            }
            desc = localize(DESC[5], locale, { value: eff });
            cost = calcCost(240, 40, 1.8);
            break;
          case 3:
            eff = level.toString();
            desc = localize(DESC[6], locale, { value: eff });
            cost = calcCost(250, 50, 1.8);
            break;
        }
        break;
      case 5:
        switch (s) {
          case 0:
            eff = level.mul(0.5).add(1).toString();
            desc = localize(DESC[7], locale, { value: eff });
            cost = calcCost(300, 100, 1.75);
            break;
          case 1:
            eff = level.mul(0.5).add(1).toString();
            desc = localize(DESC[8], locale, { value: eff });
            cost = calcCost(320, 80, 1.8);
            break;
          case 2:
            eff = BigDouble.fromNumber(20).pow(level).toString();
            desc = localize(DESC[9], locale, { value: eff });
            cost = calcCost(333, 67, 1.666);
            break;
          case 3:
            eff = BigDouble.fromNumber(100).pow(level).toString();
            desc = localize(DESC[9], locale, { value: eff });
            cost = calcCost(360, 90, 1.6);
            break;
        }
        break;
      case 6:
        eff = level.add(1).toString();
        desc = localize(DESC[10], locale, { value: eff, type: getResourceLabel(s) });
        cost = calcCost(500, 140, 2.25);
        break;
      case 7:
        let raw2 = level.mul(0.005);
        if (raw2.greaterThan(0.01)) {
          raw2 = raw2.div(0.01).pow(0.4).mul(0.01);
        }
        eff = raw2.toString();
        desc = localize(DESC[11], locale, { value: eff, type: getResourceLabel(s) });
        switch (s) {
          case 0:
            cost = calcCost(1200, 600, 1.4);
            break;
          case 1:
            cost = calcCost(1300, 500, 1.6);
            break;
          case 2:
            cost = calcCost(1400, 400, 1.8);
            break;
          case 3:
            cost = calcCost(1500, 300, 2);
            break;
        }
        break;
      case 8:
        eff = level.mul(2).toString();
        desc = localize(DESC[12], locale, { value: eff, type: getResourceLabel(s) });
        cost = calcCost(2000, 2000, 3);
        break;
    }

    return (<div>
      {i === 2 && <BigDoubleInput
        label={`${getResourceLabel(s)} ${localize(LABELS.resourceAmount, locale)}: `}
        value={extra}
        onChange={(val) => setExtra(val)}
        isValid={(val) => val.greaterThanEqual(0)}
      />}
      <div>{localize(LABELS.effect, locale)}: {desc}</div>
      <div>{localize(LABELS.cost, locale)}: {cost}</div>
    </div>);
  }

  document.body.onresize = () => setF(!f);

  const SUIT_LOCALIZED: Record<SUIT, LocalizedText> = {
    S: { ja: "ソード", en: "Sword" },
    W: { ja: "ワンド", en: "Wand" },
    P: { ja: "ペンタクル", en: "Pentacle" },
    C: { ja: "カップ", en: "Cups" },
  };

  const localizedSuitNames: Record<SUIT, string> = {
    S: localize(SUIT_LOCALIZED.S, locale),
    W: localize(SUIT_LOCALIZED.W, locale),
    P: localize(SUIT_LOCALIZED.P, locale),
    C: localize(SUIT_LOCALIZED.C, locale),
  };

  const w = Math.min(383, document.documentElement.clientWidth - 45);
  const m = w / 383;
  const h = 650 * m;
  const o = m * 65;

  return (
    <div>
      <h3 style={{ margin: "20px 0" }}>{localizedSuitNames[suit]}</h3>
      <div style={{
        width: "100%", position: "relative", height: `${h}px`,
        overflowX: "hidden", marginBottom: "20px"
      }}>
        {suits.map((s, i) => {
          const t = getType(s);
          return (
            <div
              style={{ width: `${w}px`, height: `${h}px` }}
              className={`tu-container ${t}`} key={s}
            >
              <div style={{ position: "relative" }}
              >
                {POSITIONS[i].map(([x, y], i) => (<button
                  style={{ left: (x - 89) * m + o, top: (y - 130) * m + o,
                    position: "absolute", width: `${o}px`, height: `${o}px` }}
                  className={`tu-button ${curSuit !== null &&
                    suits[curSuit] === s && upId === i ? "active" : ""}`}
                  onClick={() => {
                    if (curSuit !== null && suits[curSuit] === s && upId === i) {
                      setCurSuit(null);
                      setUpId(null);
                      return;
                    }
                    setCurSuit(suits.indexOf(s));
                    setUpId(i);
                  }}
                  key={[s, i].toString()}
                >{i + 1}</button>))}
              </div>
            </div>)
        })}
        <button
          className="tu-button"
          onClick={() => setSuit(switchLeft(suit))}
          style={{
            position: "absolute", top: 0, bottom: 0,
            margin: "auto 0", left: "50px", zIndex: 2,
            width: `${o}px`, height: `${o}px`
          }}
        >←</button>
        <button
          className="tu-button"
          onClick={() => setSuit(switchRight(suit))}
          style={{
            position: "absolute", top: 0, bottom: 0,
            margin: "auto 0", right: "50px", zIndex: 2,
            width: `${o}px`, height: `${o}px`
          }}
        >→</button>
      </div>
      <h3>{curSuit !== null ? localizedSuitNames[suits[curSuit]] : ""}</h3>
      <h3>{upId !== null ? `${localize(LABELS.upgrade, locale)} ${upId + 1}` : ""}</h3>

      {curSuit !== null && upId !== null &&
        (<>
          <BigDoubleInput
            label={localize(LABELS.level, locale)}
            value={level ?? BigDouble.ONE}
            onChange={(val) => {
              setLevel(val.round());
            }}
            isValid={(val) => val.greaterThan(BigDouble.ZERO) &&
              val.isInteger()}
          />
          {update(curSuit, upId)}
        </>)
      }
    </div>
  );
}

export default TarotUpgrade;