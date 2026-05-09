import { useState } from "react";
import BigDoubleInput from "../../components/BigDoubleInput";
import { BigDouble } from "../../types/BigDouble";
import { localize, useLocale, type LocalizedText } from "../../i18n";

const LABEL : LocalizedText = {
  ja: "タロット資源量：",
  en: "Tarot Resource Amount: "
}

const RES : LocalizedText = {
  ja: "金資源獲得量：",
  en: "Golden Resource Amount: "
}

const BOOST : LocalizedText = {
  ja: "金資源ブースト乗数[%]：",
  en: "Boost Golden Resource Mult [%]: "
}

const R59_EFF : LocalizedText = {
  ja: "遺物59の効果：",
  en: "Relic 59 Effect: "
}

const GoldenResource = () => {
  const [amo, setAmo] = useState(BigDouble.ONE);
  const [boost, setBoost] = useState(BigDouble.ZERO);
  const [r59Eff, setR59Eff] = useState(BigDouble.ONE);

  const locale = useLocale();

  const calc = () => {
    let r = amo.pow(0.001).mul(amo.add(1).log10()).div(1500);
    if (r.greaterThan(10)) {
      r = r.div(10).pow(0.5).mul(10);
    }
    if (r.greaterThan(100)) {
      r = r.div(100).pow(0.25).mul(100);
    }
    if (r.greaterThan(1000)) {
      r = r.div(1000).pow(0.1).mul(1000);
    }
    r = r.mul(boost.div(100).add(1)).mul(r59Eff);
    return r;
  }

  return (<div>
    <BigDoubleInput 
      label={localize(LABEL, locale)}
      value={BigDouble.ONE}
      onChange={(val) => {
        setAmo(val)
      }}
      isValid={(val) => val.greaterThanEqual(BigDouble.ZERO)}
    />
    <div style={{ marginBottom: 10 }}></div>
    <BigDoubleInput 
      label={localize(R59_EFF, locale)}
      value={BigDouble.ONE}
      onChange={(val) => {
        setR59Eff(val)
      }}
      isValid={(val) => val.greaterThanEqual(BigDouble.ONE)}
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
    <div style={{ marginTop: 10 }}>
      {localize(RES, locale)}{calc().toString()}
    </div>
  </div>)
}

export default GoldenResource;
