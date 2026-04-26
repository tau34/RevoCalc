import { useState } from "react";
import BigDoubleInput from "../../components/BigDoubleInput";
import { BigDouble } from "../../types/BigDouble";

type SUIT = "S" | "W" | "P" | "C";
const suits: SUIT[] = ["S", "W", "P", "C"];
const suitNames: Record<SUIT, string> = {
  S: "Sword",
  W: "Wand",
  P: "Pentacle",
  C: "Cups",
};

const switchLeft = (suit: SUIT): SUIT => {
  const i = suits.indexOf(suit);
  return suits[(i - 1 + 4) % 4];
};

const switchRight = (suit: SUIT): SUIT => {
  const i = suits.indexOf(suit);
  return suits[(i + 1) % 4];
};

const TarotUpgrade = () => {
  const [suit, setSuit] = useState<SUIT>("S");
  const [curSuit, setCurSuit] = useState<number | null>(null);
  const [upId, setUpId] = useState<number | null>(null);
  const [level, setLevel] = useState<BigDouble>(BigDouble.ONE);
  const [extra, setExtra] = useState<BigDouble>(BigDouble.ZERO);

  const POSITIONS = [[[183, 72], [183, 178], [183, 274], [183, 365],
  [183, 457], [183, 543], [93, 543], [273, 543], [183, 645]],
  [[108, 110], [36, 180], [36, 332], [108, 403], [183, 525], [258, 403],
  [330, 332], [330, 180], [257, 110]], [[183, 302], [183, 193],
  [88, 273], [278, 273], [122, 381], [238, 381], [88, 183], [278, 183],
  [46, 351]], [[183, 104], [183, 195], [183, 284], [183, 374],
  [183, 452], [183, 523], [183, 604], [68, 604], [298, 604]]];

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

  const getAmountLabel = (s: number) => {
    switch (s) {
      case 0: return "Swords";
      case 1: return "Wands";
      case 2: return "Pentacles";
      case 3: return "Cups";
    }
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

    switch (i) {
      case 0:
        eff = level.pow(0.25).mul(0.01).toString();
        cost = new BigDouble(1, 6).mul(
          new BigDouble(1, 9).pow(level.sub(1))).toString();
        break;
      case 1:
        eff = level.mul(s === 3 ? 0.15 : 0.06).add(1).toString();
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
        cost = new BigDouble(1, 12).mul(
          new BigDouble(1, 13).pow(level.sub(1))).toString();
        break;
      case 3:
        eff = level.toString();
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
            cost = calcCost(200, 50, 1.75);
            break;
          case 1:
            if (level.greaterThan(0)) {
              eff = BigDouble.fromNumber(1.05).pow(level.sub(1))
                .mul(1000).toString();
            } else {
              eff = "1";
            }
            cost = calcCost(210, 60, 1.8);
            break;
          case 2:
            if (level.greaterThan(0)) {
              eff = level.sub(1).mul(0.1).add(1.4).toString();
            } else {
              eff = "1";
            }
            cost = calcCost(240, 40, 1.8);
            break;
          case 3:
            eff = level.toString();
            cost = calcCost(250, 50, 1.8);
            break;
        }
        break;
      case 5:
        switch (s) {
          case 0:
            eff = level.mul(0.5).add(1).toString();
            cost = calcCost(300, 100, 1.75);
            break;
          case 1:
            eff = level.mul(0.5).add(1).toString();
            cost = calcCost(320, 80, 1.8);
            break;
          case 2:
            eff = BigDouble.fromNumber(20).pow(level).toString();
            cost = calcCost(333, 67, 1.666);
            break;
          case 3:
            eff = BigDouble.fromNumber(100).pow(level).toString();
            cost = calcCost(360, 90, 1.6);
            break;
        }
        break;
      case 6:
        eff = level.add(1).toString();
        cost = calcCost(500, 140, 2.25);
        break;
      case 7:
        let raw2 = level.mul(0.005);
        if (raw2.greaterThan(0.01)) {
          raw2 = raw2.div(0.01).pow(0.4).mul(0.01);
        }
        eff = raw2.toString();
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
        cost = calcCost(2000, 2000, 3);
        break;
    }

    return (<div>
      {i === 2 && <BigDoubleInput
        label={`${getAmountLabel(s)} Amount: `}
        value={extra}
        onChange={(val) => setExtra(val)}
        isValid={(val) => val.greaterThanEqual(0)}
      />}
      <div>Effect: {eff}</div>
      <div>Cost: {cost}</div>
    </div>);
  }

  const w = Math.min(383, document.documentElement.clientWidth);
  const m = w / 383;
  const h = 650 * m;

  return (
    <div>
      <h3 style={{ margin: "20px 0" }}>{suitNames[suit]}</h3>
      <div style={{
        width: "100%", position: "relative", height: `${h}px`,
        overflowX: "hidden", marginBottom: "20px"
      }}>
        {suits.map((s, i) => {
          const t = getType(s);
          return (
            <div
              style={{ transform: `scale(${m})` }}
              className={`tu-container ${t}`} key={s}
            >
              <div style={{ position: "relative" }}
              >
                {POSITIONS[i].map(([x, y], i) => (<button
                  style={{ left: x - 24, top: y - 70, position: "absolute" }}
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
            margin: "auto 0", left: "50px", zIndex: 2
          }}
        >←</button>
        <button
          className="tu-button"
          onClick={() => setSuit(switchRight(suit))}
          style={{
            position: "absolute", top: 0, bottom: 0,
            margin: "auto 0", right: "50px", zIndex: 2
          }}
        >→</button>
      </div>
      <h3>{curSuit !== null ? suitNames[suits[curSuit]] : ""}</h3>
      <h3>{upId !== null ? `Upgrade ${upId + 1}` : ""}</h3>

      {curSuit !== null && upId !== null &&
        (<>
          <BigDoubleInput
            label="Level: "
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