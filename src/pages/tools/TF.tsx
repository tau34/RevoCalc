import { useState } from "react";
import BigDoubleInput from "../../components/BigDoubleInput";
import { BigDouble } from "../../types/BigDouble";
import { localize, useLocale, type LocalizedText } from "../../i18n";

const TF_GAIN : LocalizedText = {
  ja: "TF取得レベル：",
  en: "TF Gain Lv: "
}
const TF_CAP : LocalizedText = {
  ja: "TF容量レベル：",
  en: "TF Capacity Lv: "
}
const OF_CAP : LocalizedText = {
  ja: "OF容量レベル：",
  en: "OF Capacity Lv: "
}
const BOOST : LocalizedText = {
  ja: "ショップのTF取得ブースト[%]：",
  en: "Shop TF Gain Boost [%]: "
}
const COST : LocalizedText = {
  ja: "アップグレードコスト：{value} TF",
  en: "Upgrade cost: {value} TF"
}
const SECRETS : LocalizedText = {
  ja: "隠し実績の達成数：",
  en: "Completed Secret Achievements: "
}
const OF_ENABLED : LocalizedText = {
  ja: "OFが有効",
  en: "OF enabled"
}
const TF_CONVERTED : LocalizedText = {
  ja: "変換されたTF[%]：",
  en: "Converted TF [%]: "
}
const RES_TF_GAIN : LocalizedText = {
  ja: "TF取得：{value}/時",
  en: "TF Gain: {value}/h"
}
const RES_OF_GAIN : LocalizedText = {
  ja: "OF取得：{value}/時",
  en: "OF Gain: {value}/h"
}
const RES_TF_CAP : LocalizedText = {
  ja: "TF容量：{value}",
  en: "TF Capacity: {value}"
}
const RES_OF_CAP : LocalizedText = {
  ja: "OF容量：{value}",
  en: "OF Capacity: {value}"
}

const TF = () => {
  const [tfGainLv, setTfGainLv] = useState(BigDouble.ZERO);
  const [tfCapLv, setTfCapLv] = useState(BigDouble.ZERO);
  const [ofCapLv, setOfCapLv] = useState(BigDouble.ZERO);
  const [boost, setBoost] = useState(BigDouble.ZERO);
  const [secrets, setSecrets] = useState(BigDouble.ZERO);
  const [ofEnabled, setOFEnabled] = useState(false);
  const [ratio, setRatio] = useState(BigDouble.ZERO);

  const locale = useLocale();
  
  const calcTFCap = (lv: BigDouble) => {
    if (lv.lessThan(7)) {
      return BigDouble.fromNumber(2).pow(lv).mul(1800);
    }
    if (lv.lessThan(8)) {
      return BigDouble.fromNumber(172800);
    }
    if (lv.lessThan(14)) {
      return lv.sub(7).div(2).add(2).mul(86400);
    }
    if (lv.lessThan(20)) {
      return lv.sub(13).div(3).add(5).mul(86400);
    }
    if (lv.lessThan(32)) {
      return lv.sub(19).div(6).add(7).mul(86400);
    }
    if (lv.lessThan(44)) {
      return lv.sub(31).div(6).add(10).mul(86400);
    }
    if (lv.lessThan(60)) {
      return lv.sub(43).div(8).add(12).mul(86400);
    }
    if (lv.lessThan(144)) {
      return lv.sub(59).div(12).add(14).mul(86400);
    }
    if (lv.lessThan(288)) {
      return lv.sub(143).div(16).add(21).mul(86400);
    }
    return lv.sub(287).div(24).add(30).mul(86400);
  }

  const calcTFGain = () => {
    let r = tfGainLv.add(1).div(tfGainLv.add(10)).mul(3600);
    if (ofEnabled) {
      let t = r.greaterThan(1800) ? BigDouble.fromNumber(1800) : r;
      r = r.sub(t.mul(ratio.mul(0.01)));
    } else {
      r = r.add(360);
    }
    return r.mul(boost.mul(0.01).add(1)).mul(secrets.mul(0.001).add(1));
  }

  const calcOFGain = () => {
    let r = tfGainLv.add(1).div(tfGainLv.add(10)).mul(3600);
    if (ofEnabled) {
      let t = r.greaterThan(1800) ? BigDouble.fromNumber(1800) : r;
      return t.mul(ratio.mul(0.1).div(6).add(600));
    } else {
      return BigDouble.ZERO;
    }
  }

  return (<div>
    <BigDoubleInput 
      label={localize(TF_GAIN, locale)}
      value={BigDouble.ZERO}
      onChange={(val) => {
        setTfGainLv(val)
      }}
      isValid={(val) => val.greaterThanEqual(BigDouble.ZERO) &&
        val.isInteger()}
    />
    <div style={{ marginBottom: 10 }}>
      {localize(COST, locale, {
        value: BigDouble.fromNumber(1.3).pow(tfGainLv).mul(1800).toStringAsTime()
      })}
    </div>
    <div style={{ marginBottom: 10 }}></div>
    <BigDoubleInput 
      label={localize(TF_CAP, locale)}
      value={BigDouble.ZERO}
      onChange={(val) => {
        setTfCapLv(val)
      }}
      isValid={(val) => val.greaterThanEqual(BigDouble.ZERO) &&
        val.isInteger()}
    />
    <div style={{ marginBottom: 10 }}>
      {localize(COST, locale, {
        value: calcTFCap(tfCapLv).mul(0.75).toStringAsTime()
      })}
    </div>
    <div style={{ marginBottom: 10 }}></div>
    <BigDoubleInput 
      label={localize(OF_CAP, locale)}
      value={BigDouble.ZERO}
      onChange={(val) => {
        setOfCapLv(val)
      }}
      isValid={(val) => val.greaterThanEqual(BigDouble.ZERO) &&
        val.isInteger()}
    />
    <div style={{ marginBottom: 10 }}>
      {localize(COST, locale, {
        value: calcTFCap(ofCapLv.add(4)).mul(1.5).toStringAsTime()
      })}
    </div>
    <div style={{ marginBottom: 10 }}></div>
    <BigDoubleInput 
      label={localize(SECRETS, locale)}
      value={BigDouble.ZERO}
      onChange={(val) => {
        setSecrets(val)
      }}
      isValid={(val) => val.greaterThanEqual(BigDouble.ZERO) &&
        val.isInteger()}
    />
    <div style={{ marginBottom: 10 }}></div>
    <BigDoubleInput 
      label={localize(BOOST, locale)}
      value={BigDouble.ZERO}
      onChange={(val) => {
        setBoost(val)
      }}
      isValid={(val) => val.greaterThanEqual(BigDouble.ZERO)}
    />
    <div style={{ marginBottom: 10 }}></div>
    <label className="checkbox">
      <div className="checkbox-container">
        <input type="checkbox" checked={ofEnabled}
          onChange={(e) => setOFEnabled(e.target.checked)} />
        <span className="checkmark"></span>
        <span>{localize(OF_ENABLED, locale)}</span>
      </div>
    </label>
    <div style={{ marginBottom: 10 }}></div>
    <BigDoubleInput 
      label={localize(TF_CONVERTED, locale)}
      value={BigDouble.ZERO}
      onChange={(val) => {
        setRatio(val)
      }}
      isValid={(val) => val.greaterThanEqual(BigDouble.ZERO) &&
        val.lessThanEqual(100)}
    />
    <div style={{ marginTop: 30 }}>
      {localize(RES_TF_GAIN, locale, { 
        value: calcTFGain().toStringAsTime()
      })}
    </div>
    <div style={{ marginTop: 10 }}>
      {localize(RES_OF_GAIN, locale, { 
        value: calcOFGain().toStringAsTime()
      })}
    </div>
    <div style={{ marginTop: 10 }}>
      {localize(RES_TF_CAP, locale, {
        value: calcTFCap(tfCapLv).toStringAsTime()
      })}
    </div>
    <div style={{ marginTop: 10 }}>
      {localize(RES_OF_CAP, locale, {
        value: calcTFCap(ofCapLv.add(4)).mul(3).toStringAsTime()
      })}
    </div>
  </div>);
}

export default TF;
