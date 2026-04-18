import React, { useState } from "react";
import BigDoubleInput from "../../components/BigDoubleInput";
import { BigDouble } from "../../types/BigDouble";
import OutputTable from "../../components/OutputTable";

const LuckCalc = () => {
  const [luck, setLuck] = useState<BigDouble>(new BigDouble(1, 0));
  const ach : [number, boolean, React.Dispatch<React.SetStateAction<boolean>>][] = 
    [220, 265, 266, 342, 426, 482].map((_) => {
      const [state, setState] = useState(true);
      return [_, state, setState];
    });

  const RARITIES = ["Garbage", "Common", "Uncommon", "Rare", 
    "Epic", "Legendary", "Mythic", "Godly", "Divine", "Immortal"];
  const CONSTANTS = [
    [3, 5, 0.8, 1, 0, 2, 0.4],
    [5, 15, 1, 1, 0, 2, 0.45],
    [8, 20, 1.5, 1, 12, 3, 0.5],
    [12, 30, 1.45, 1, 28, 5, 0.55],
    [20, 45, 1.4, 2, 50, 8, 0.6],
    [30, 80, 1.36, 3, 100, 12, 0.64],
    [40, 120, 1.3, 5, 140, 20, 0.67],
    [60, 150, 1.25, 8, 200, 30, 0.7]
  ];
  const SUP = ["Ethereal", "Amazing", "Prime"];
  const COLORS = ["#606060", "#B5B5B5", "#7F9C4C", "#6686C1",
    "#BC5CC0", "#D7A767", "#BB595A", "#EEF06B", "#B2F8EE",
    "#9CFCCE", "#811C3E", "#F7CDE3", "#FFFFFD"];
  const maxBase = ach[0][1] ? ach[3][1] ? ach[4][1] ? ach[5][1] ? 3 : 2 : 1 : 0 : -1;

  class PlusRarity {
    base: number;
    plus: BigDouble;

    constructor(base: number, plus: BigDouble) {
      this.base = base;
      if (plus.lessThanEqual(1001)) {
        let p = plus.toNumber();
        if (Math.abs(p - Math.round(p)) < 1e-6) {
          plus = BigDouble.fromNumber(Math.round(p));
        }
      }
      this.plus = plus;
    }

    demote() {
      if (this.plus.lessThanEqual(0)) {
        return new PlusRarity(this.base - 1, BigDouble.fromNumber(1000));
      }
      return new PlusRarity(this.base, this.plus.sub(1));
    }

    performSC(sc: SCFunc): boolean {
      if (this.plus.lessThanEqual(sc.min)) return false;
      this.plus = sc.func(this.plus).floor();
      this.base = sc.base;
      return true;
    }

    inverseSC(sc: SCFunc) {
      this.plus = sc.inverse(this.plus);
    }
  }

  type SCFunc = {
    func: (before: BigDouble) => BigDouble;
    inverse: (after: BigDouble) => BigDouble;
    min: number;
    base: number;
  }

  const SC_FUNCS: SCFunc[] = [
    { 
      func: (before) => before.div(100).pow(0.125).mul(100), 
      inverse: (after) => after.div(100).pow(8).mul(100), 
      min: 100,
      base: 0
    },
    { 
      func: (before) => before.div(1000).pow(0.2).mul(1000), 
      inverse: (after) => after.div(1000).pow(5).mul(1000), 
      min: 1000,
      base: 0
    },
    { 
      func: (before) => before.sub(1000).div(100), 
      inverse: (after) => after.mul(100).add(1000), 
      min: 1000,
      base: 1
    },
    { 
      func: (before) => before.div(1000).pow(0.05).mul(1000)
        .sub(1000).div(400), 
      inverse: (after) => after.mul(400).add(1000)
        .div(1000).pow(20).mul(1000), 
      min: 1000,
      base: 2
    },
    { 
      func: (before) => before.div(1000).log10(), 
      inverse: (after) => BigDouble.pow(10, after).mul(1000), 
      min: 1000,
      base: 3
    }
  ];

  function formatChance(chance: number): string {
    if (chance < 1e-12) {
      return "0%";
    }
    if (chance < 0.0001) {
      return chance.toExponential(2) + "%";
    }
    if (chance >= 1) {
      return "100%";
    }
    let exp = Math.floor(Math.log10(chance));
    return (chance * 100).toFixed(1 - exp) + "%";
  }

  function update() {
    let result : { label: string; value: string; color?: string, textColor?: string }[] =
      RARITIES.map((r, i) => ({ label: r, value: "0%", textColor: COLORS[i] }));

    let scLuck = luck.greaterThan(18) ? luck.div(18).pow(0.3).mul(18)
        : luck;
    let chances : number[] = [];
    if (scLuck.lessThan(100)) {
      let luckNum = scLuck.toNumber();
      let res : number[] = [];

      for (let i = 0; i < CONSTANTS.length; i++) {
        const [a, b, c, d, e, f, g] = CONSTANTS[i];
        let chance = 0;
        if (luckNum <= a) {
          chance = b * Math.pow(c, luckNum - d) - e;
          if (luckNum > f) {
            chance *= Math.pow(g, luckNum - f);
          }
        }
        res.push(Math.max(0, chance));
      }

      let chance1 = 0;
      if (luckNum <= 70) {
        chance1 = 200 * Math.pow(1.2, luckNum - 12) - 300;
        if (luckNum > 40) {
          chance1 *= Math.pow(0.92, luckNum - 40);
        }
        if (luckNum > 50) {
          chance1 *= Math.pow(0.72, luckNum - 50);
        }
      }
      res.push(Math.max(0, chance1));
      res.push(Math.max(0, 300 * Math.pow(1.1, luckNum - 20) - 500));

      let sum = res.reduce((s, v) => s + v);
      chances = res.map(c => c / sum);
    } else {
      chances = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
    }

    chances.forEach((chance, i) => {
      result[i].value = formatChance(chance);
    });
    
    if (scLuck.lessThanEqual(50) || maxBase === -1) {
      return [...result, ...SUP.filter((_, i) => i < maxBase)
        .map((s, i) => ({
          label: s,
          value: "0%",
          textColor: COLORS[i + 9]
        }))
      ];
    }

    let plus = scLuck.sub(45).div(4.95).round();
    let i = 0;
    let rarity = new PlusRarity(0, plus);
    while (rarity.performSC(SC_FUNCS[i])) {
      if (rarity.base > maxBase) {
        rarity.plus = BigDouble.fromNumber(1000);
        rarity.base = maxBase;
        break;
      }
      i++;
      if (i >= SC_FUNCS.length) {
        break;
      }
    }

    let flag = true;
    let r = new PlusRarity(rarity.base, rarity.plus.add(1));
    let res : [number, PlusRarity][] = [];
    let prev = BigDouble.ONE;
    let c = true;
    while (flag) {
      let r1 = r.demote();
      let r2 = new PlusRarity(r1.base, r1.plus);
      if (r2.base < 0) {
        res = [[prev.toNumber(), r], ...res];
        break;
      }
      for (let j = i - 1 - (rarity.base - r2.base); j >= 0; j--) {
        r2.inverseSC(SC_FUNCS[j]);
      }
      let ratio = plus.equals(BigDouble.ZERO) ? prev : 
        r2.plus.div(plus).pow(ach[2][1] ? 25 : ach[1][1] ? 10 : 2);
      
      if (c) {
        c = false;
        if (ratio.lessThan(new BigDouble(1, -9))) {
          flag = false;
          res = [[prev.toNumber(), r1], ...res];
        }
      } else if (ratio.lessThan(new BigDouble(1, -9))) {
        flag = false;
        res = [[prev.toNumber(), r], ...res];
      } else {
        res = [[prev.sub(ratio).toNumber(), r], ...res];
        prev = ratio;
      }
      r = r1;
    }

    let map : [number, [BigDouble, number][]][] = [
      [0, []], [0, []], [0, []], [0, []]
    ];
    res.forEach(([chance, rarity]) => {
      map[rarity.base][0] += chance;
      map[rarity.base][1].push([rarity.plus, chance]);
    });

    let mul = chances[9];
    result[9].value = formatChance(map[0][0] * mul);
    for (let i = 0; i < maxBase + 1; i++) {
      if (i > 0) result.push({ 
        label: SUP[i - 1], 
        value: formatChance(map[i][0] * mul) ,
        textColor: COLORS[i + 9]
      });
      map[i][1].forEach(([c, r]) => {
        result.push({
          label: `${i === 0 ? "Immortal" : SUP[i - 1]}+${c.floor().toString()}`,
          value: formatChance(r * mul),
          color: "#f0f4f8",
          textColor: COLORS[i + 9]
        });
      });
    }
    return result;
  }

  return (
    <div>
      <BigDoubleInput
        label="Luck: "
        value={luck}
        onChange={(val) => {
          setLuck(val);
        }}
      />

      {ach.map(([num, state, setState]) => (
        <label className="checkbox" key={num}>
          <div className="checkbox-container">
            <input type="checkbox" checked={state} 
              onChange={(e) => setState(e.target.checked)} />
            <span className="checkmark"></span>
            <span>Ach.{num} completed</span>
          </div>
        </label>
      ))}

      <OutputTable data={update()} />
    </div>
  );
}

export default LuckCalc;