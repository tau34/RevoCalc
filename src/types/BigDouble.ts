export class BigDouble {
  mantissa: number;
  exponent: number;
  static ZERO = new BigDouble(0, 0);
  static ONE = new BigDouble(1, 0);
  static NaN = new BigDouble(NaN, 0);

  constructor(mantissa: number, exponent: number) {
    this.mantissa = mantissa;
    this.exponent = exponent;
  }

  normalize() {
    if (isNaN(this.mantissa) || isNaN(this.exponent)) {
      this.mantissa = NaN;
      this.exponent = 0;
      return;
    }
    if (this.mantissa === Infinity) {
      this.mantissa = Infinity;
      this.exponent = 0;
      return;
    }
    if (this.mantissa === -Infinity) {
      this.mantissa = -Infinity;
      this.exponent = 0;
      return;
    }
    if (this.mantissa === 0) {
      this.exponent = 0;
      return;
    }
    if (!BigDouble.isIntNumber(this.exponent)) {
      const f = Math.floor(this.exponent);
      const d = this.exponent - f;
      this.mantissa *= Math.pow(10, d);
      this.exponent = f;
    }
    const M = Math.abs(this.mantissa);
    if (M >= 10) {
      const power = Math.floor(Math.log10(M));
      this.mantissa /= Math.pow(10, power);
      this.exponent += power;
    } else if (M < 1) {
      const power = Math.ceil(-Math.log10(M));
      this.mantissa *= Math.pow(10, power);
      this.exponent -= power;
    }
  }

  static normalize(value: BigDouble): BigDouble {
    value.normalize();
    return value;
  }

  static fromNumber(value: number): BigDouble {
    if (value === 0) {
      return new BigDouble(0, 0);
    }
    if (isNaN(value)) {
      return new BigDouble(NaN, 0);
    }
    if (value === Infinity) {
      return new BigDouble(Infinity, 0);
    }
    if (value === -Infinity) {
      return new BigDouble(-Infinity, 0);
    }
    const mantissa = value;
    const exponent = 0;
    return BigDouble.normalize(new BigDouble(mantissa, exponent));
  }

  static fromString(value: string): BigDouble {
    //X.XX
    //X.XXeXX
    //eX.XX
    //eX.XXeXX
    //eeX.XX
    try {
      const eParts = value.split('e');
      if (eParts.length === 1) {
        return BigDouble.fromNumber(parseFloat(eParts[0]));
      }
      if (eParts.length === 2) {
        let m = eParts[0] === "" ? 1 : parseFloat(eParts[0]);
        return BigDouble.normalize(new BigDouble(m,
          parseFloat(eParts[1])));
      }
      if (eParts.length === 3) {
        let m = eParts[1] === "" ? 1 : parseFloat(eParts[1]);
        return BigDouble.normalize(new BigDouble(1, 
          m * Math.pow(10, parseFloat(eParts[2]))));
      }
      return BigDouble.NaN;
    } catch {
      return BigDouble.NaN;
    }
  }

  toNumber(): number {
    return this.mantissa * Math.pow(10, this.exponent);
  }

  toString(): string {
    const E5 = new BigDouble(1, 5);
    const E9 = new BigDouble(1, 9);
    const E1E5 = new BigDouble(1, 1e5);
    const E1E9 = new BigDouble(1, 1e9);
    
    if (this.isNaN()) {
      return 'NaN';
    }
    if (this.equals(BigDouble.ZERO)) {
      return '0';
    }
    if (this.mantissa === Infinity || this.exponent === Infinity) {
      return "eInfinity";
    }
    if (this.lessThan(0.0001)) {
      const exp = Math.floor(this.log10AsNumber());
      const mag = Math.pow(10, exp);
      const scaled = this.toNumber() / mag;
      return `${scaled.toFixed(4)}e${exp}`;
    }
    if (this.lessThan(BigDouble.ONE)) {
      let exp = Math.floor(Math.log10(this.toNumber()));
      return this.toNumber().toFixed(4 - exp);
    }
    if (this.lessThan(E5)) {
      const exp = Math.floor(this.log10AsNumber());
      const mag = Math.pow(10, exp);
      const scaled = this.toNumber() / mag;
      const res = Number.parseFloat(scaled.toFixed(4)) * mag;
      return res.toFixed(4);
    }
    if (this.lessThan(E9)) {
      return Math.round(this.toNumber()) + '';
    }
    this.normalize();
    if (this.lessThan(E1E5)) {
      return this.mantissa.toFixed(4) + 'e' + 
        Math.round(this.exponent);
    }
    if (this.lessThan(E1E9)) {
      return 'e' + Math.round(this.exponent);
    }
    const ee = Math.floor(Math.log10(this.exponent));
    const mag = Math.pow(10, ee);
    const scaled = this.exponent / mag;
    const res = Number.parseFloat(scaled.toFixed(4));
    return `e${res.toFixed(4)}e${ee}`;
  }

  toSimpleString(): string {
    return this.toNumber().toString();
  }

  toStringAsTime(): string {
    if (this.lessThan(0)) {
      return '-' + this.negate().toStringAsTime();
    }
    if (this.lessThan(1e-7)) {
      return this.toString() + 's';
    }
    if (this.lessThan(1)) {
      const e = Math.floor(Math.log10(this.toNumber()));
      return (this.toNumber() * 1000).toFixed(-e) + 'ms';
    }
    if (this.lessThan(10)) {
      return this.toNumber().toFixed(3) + 's';
    }
    if (this.lessThan(60)) {
      return this.toNumber().toFixed(2) + 's';
    }
    const pf = (x: number) => x < 10 ? '0' + x.toFixed(2) : x.toFixed(2);
    if (this.lessThan(3600)) {
      let m = Math.floor(this.toNumber() / 60);
      let s = this.toNumber() % 60;
      if (s > 59.995) {
        m ++;
        s = 0;
      }
      if (m >= 60) {
        return "1:00:00";
      }
      return `${m}:${pf(s)}`;
    }
    const p = (x: number) => x.toString().padStart(2, "0");
    if (this.lessThan(86400)) {
      let h = Math.floor(this.toNumber() / 3600);
      let m = Math.floor((this.toNumber() % 3600) / 60);
      let s = this.toNumber() % 60;
      if (s > 59.995) {
        m ++;
        s = 0;
      }
      if (m >= 60) {
        h ++;
        m -= 60;
      }
      if (h >= 24) {
        return "1d 00:00:00";
      }
      return `${h}:${p(m)}:${pf(s)}`;
    }
    if (this.lessThan(365 * 86400)) {
      let d = Math.floor(this.toNumber() / 86400);
      let h = Math.floor((this.toNumber() % 86400) / 3600);
      let m = Math.floor((this.toNumber() % 3600) / 60);
      let s = this.toNumber() % 60;
      if (s > 59.5) {
        m ++;
        s = 0;
      }
      if (m >= 60) {
        h ++;
        m -= 60;
      }
      if (h >= 24) {
        d ++;
        h -= 24;
      }
      if (d >= 365) {
        return "1y 0.00d";
      }
      return `${d}d ${p(h)}:${p(m)}:${s.toFixed(0).padStart(2, "0")}`;
    }
    if (this.lessThan(100 * 365 * 86400)) {
      const y = Math.floor(this.toNumber() / (365 * 86400));
      const d = (this.toNumber() % (365 * 86400)) / 86400;
      return `${y}y ${d.toFixed(2)}d`;
    }
    if (this.lessThan(1000 * 365 * 86400)) {
      const y = this.toNumber() / (365 * 86400);
      return `${y.toFixed(3)}y`;
    }
    if (this.lessThan(10000 * 365 * 86400)) {
      const y = this.toNumber() / (365 * 86400);
      return `${y.toFixed(2)}y`;
    }
    if (this.lessThan(1e9 * 365 * 86400)) {
      const y = this.toNumber() / (365 * 86400);
      return `${y.toFixed(0)}y`;
    }
    return this.div(365 * 86400).toString() + 'y';
  }

  isNaN(): boolean {
    return isNaN(this.mantissa);
  }

  greaterThan(other: BigDouble | number): boolean {
    this.normalize();
    other = typeof other === "number" ? BigDouble.fromNumber(other) : other;
    other.normalize();
    if (this.mantissa === 0) {
      return other.mantissa < 0;
    }
    if (this.exponent > other.exponent) {
      return this.mantissa > 0;
    } else if (this.exponent < other.exponent) {
      return other.mantissa < 0;
    } else {
      return this.mantissa > other.mantissa;
    }
  }

  greaterThanEqual(other: BigDouble | number): boolean {
    this.normalize();
    other = typeof other === "number" ? BigDouble.fromNumber(other) : other;
    other.normalize();
    if (this.mantissa === 0) {
      return other.mantissa <= 0;
    }
    if (this.exponent > other.exponent) {
      return this.mantissa >= 0;
    } else if (this.exponent < other.exponent) {
      return other.mantissa <= 0;
    } else {
      return this.mantissa >= other.mantissa;
    }
  }

  lessThan(other: BigDouble | number): boolean {
    return !this.greaterThanEqual(other);
  }

  lessThanEqual(other: BigDouble | number): boolean {
    return !this.greaterThan(other);
  }

  equals(other: BigDouble | number): boolean {
    this.normalize();
    other = typeof other === "number" ? BigDouble.fromNumber(other) : other;
    other.normalize();
    return this.exponent === other.exponent && 
      this.mantissa === other.mantissa;
  }

  negate(): BigDouble {
    return new BigDouble(-this.mantissa, this.exponent);
  }

  add(other: BigDouble | number): BigDouble {
    this.normalize();
    other = typeof other === "number" ? BigDouble.fromNumber(other) : other;
    other.normalize();
    const [small, large] = this.exponent < other.exponent ? 
      [this, other] : [other, this];
    const diff = large.exponent - small.exponent;
    const mantissa = small.mantissa / Math.pow(10, diff) + large.mantissa;
    return BigDouble.normalize(new BigDouble(mantissa, large.exponent));
  }

  static add(a: BigDouble | number, b: BigDouble | number): BigDouble {
    a = typeof a === "number" ? BigDouble.fromNumber(a) : a;
    b = typeof b === "number" ? BigDouble.fromNumber(b) : b;
    return a.add(b);
  }

  sub(other: BigDouble | number): BigDouble {
    other = typeof other === "number" ? BigDouble.fromNumber(other) : other;
    return this.add(other.negate());
  }

  static sub(a: BigDouble | number, b: BigDouble | number): BigDouble {
    a = typeof a === "number" ? BigDouble.fromNumber(a) : a;
    b = typeof b === "number" ? BigDouble.fromNumber(b) : b;
    return a.sub(b);
  }

  mul(other: BigDouble | number): BigDouble {
    other = typeof other === "number" ? BigDouble.fromNumber(other) : other;
    const mantissa = this.mantissa * other.mantissa;
    const exponent = this.exponent + other.exponent;
    if (exponent === Infinity) {
      return new BigDouble(Infinity, 0);
    }
    return BigDouble.normalize(new BigDouble(mantissa, exponent));
  }

  static mul(a: BigDouble | number, b: BigDouble | number): BigDouble {
    a = typeof a === "number" ? BigDouble.fromNumber(a) : a;
    b = typeof b === "number" ? BigDouble.fromNumber(b) : b;
    return a.mul(b);
  }

  reciprocate(): BigDouble {
    const mantissa = 1 / this.mantissa;
    const exponent = -this.exponent;
    return BigDouble.normalize(new BigDouble(mantissa, exponent));
  }

  div(other: BigDouble | number): BigDouble {
    other = typeof other === "number" ? BigDouble.fromNumber(other) : other;
    return this.mul(other.reciprocate());
  }

  static div(a: BigDouble | number, b: BigDouble | number): BigDouble {
    a = typeof a === "number" ? BigDouble.fromNumber(a) : a;
    b = typeof b === "number" ? BigDouble.fromNumber(b) : b;
    return a.div(b);
  }

  pow(exponent: number | BigDouble): BigDouble {
    this.normalize();
    if (exponent instanceof BigDouble) {
      if (exponent.greaterThanEqual(Number.MAX_VALUE)) {
        return new BigDouble(Infinity, 0);
      }
      return this.pow(exponent.toNumber());
    } else {
      const mExp = Math.log10(this.mantissa) * exponent;
      const exp = this.exponent * exponent;
      const expAdd = Math.floor(mExp);
      const mantissa = Math.pow(10, mExp - expAdd);
      if (exp + expAdd === Infinity) {
        return new BigDouble(Infinity, 0);
      }
      return BigDouble.normalize(new BigDouble(mantissa, exp + expAdd));
    }
  }

  static pow(base: number | BigDouble, exponent: number | BigDouble): BigDouble {
    base = typeof base === "number" ? BigDouble.fromNumber(base) : base;
    return base.pow(exponent);
  }

  log10AsNumber(): number {
    this.normalize();
    return Math.log10(this.mantissa) + this.exponent;
  }

  static log10AsNumber(value: BigDouble | number): number {
    value = typeof value === "number" ? BigDouble.fromNumber(value) : value;
    return value.log10AsNumber();
  }

  log10(): BigDouble {
    return BigDouble.fromNumber(this.log10AsNumber());
  }

  static log10(value: BigDouble | number): BigDouble {
    value = typeof value === "number" ? BigDouble.fromNumber(value) : value;
    return value.log10();
  }

  log(base: number | BigDouble): BigDouble {
    this.normalize();
    const logBase = base instanceof BigDouble ? base.toNumber() : base;
    return BigDouble.fromNumber(this.log10AsNumber() * 
      Math.log(10) / Math.log(logBase));
  }

  static log(value: BigDouble | number, base: number | BigDouble): BigDouble {
    value = typeof value === "number" ? BigDouble.fromNumber(value) : value;
    return value.log(base);
  }

  ln(): BigDouble {
    this.normalize();
    return BigDouble.fromNumber(this.log10AsNumber() * Math.log(10));
  }

  static ln(value: BigDouble | number): BigDouble {
    value = typeof value === "number" ? BigDouble.fromNumber(value) : value;
    return value.ln();
  }

  sqrt(): BigDouble {
    this.normalize();
    return this.pow(0.5);
  }

  static sqrt(value: BigDouble): BigDouble {
    return value.sqrt();
  }

  round(): BigDouble {
    this.normalize();
    if (this.greaterThan(Number.MAX_VALUE)) {
      return this;
    }
    return BigDouble.fromNumber(Math.round(this.toNumber()));
  }

  floor(): BigDouble {
    this.normalize();
    if (this.greaterThan(Number.MAX_VALUE)) {
      return this;
    }
    return BigDouble.fromNumber(Math.floor(this.toNumber()));
  }

  abs(): BigDouble {
    return new BigDouble(Math.abs(this.mantissa), this.exponent);
  }

  static isIntNumber(value: number): boolean {
    return Math.abs(value - Math.round(value)) < 1e-9;
  }

  isInteger(): boolean {
    this.normalize();
    if (this.greaterThan(Number.MAX_VALUE) || this.lessThan(-Number.MAX_VALUE)) {
      return true;
    } else {
      const num = this.toNumber();
      return BigDouble.isIntNumber(num);
    }
  }
}