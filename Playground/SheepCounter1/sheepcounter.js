// ============================================================
// SheepCounter – Laegna base-4 (Frequential) and base-2 (Octavian)
// Real IOAE enumeration (base-4) and OA enumeration (base-2)
// Specials: W… at start, ∩… at end, U… and V… in the center
// FREQUENTIAL: complex from Laegna hex (16 complex values from IOAE pairs)
// OCTAVIAN: complex from base-4 IOAE (relative complex system)
// Small displays:
//   d0: RTS (R, T, S)
//   d1: Position scale (signed)
//   d2: Posetion scale (unsigned)
// dm: main Laegna number
// ds: secondary (complex / logecs / logic)
// ============================================================

class SheepBlock {
  constructor() {
    this.startTime = 0;
    this.endTime = 0;
    this.length = 0;
  }
  setStartTime(t) {
    this.startTime = t;
    this.endTime = t + this.length;
  }
  containsTime(t) {
    return t >= this.startTime && t < this.endTime;
  }
  toDebugJSON() {
    return {
      type: "block",
      startTime: this.startTime,
      endTime: this.endTime,
      length: this.length
    };
  }
}

class SheepPadding extends SheepBlock {
  constructor(length) {
    super();
    this.length = length;
  }
  toDebugJSON() {
    return {
      type: "padding",
      startTime: this.startTime,
      endTime: this.endTime,
      length: this.length
    };
  }
}

class SheepDisplay {
  constructor(codeName, title = "", content = "") {
    this.codeName = codeName;
    this.title = title;
    this.content = content;
    this.visible = true;
    this.meaning = "";
    this.description = "";
  }
  set(title, content, visible = true) {
    this.title = title;
    this.content = content;
    this.visible = visible;
  }
  setMeaning(meaning, description) {
    this.meaning = meaning;
    this.description = description;
  }
  toDebugJSON() {
    return {
      codeName: this.codeName,
      title: this.title,
      content: this.content,
      visible: this.visible,
      meaning: this.meaning,
      description: this.description
    };
  }
}

class SheepNumber extends SheepBlock {
  constructor(system, index, valueStr, length = 1.0) {
    super();
    this.system = system;
    this.index = index;
    this.valueStr = valueStr;
    this.length = length;
    this.displays = {
      d0: new SheepDisplay("d0", "RTS", ""),
      d1: new SheepDisplay("d1", "Position scale", ""),
      d2: new SheepDisplay("d2", "Posetion scale", ""),
      dm: new SheepDisplay("dm", "Laegna Natural Numbers", valueStr),
      ds: new SheepDisplay("ds", "Secondary", "")
    };
  }
  getLength() {
    return this.length;
  }
  toDebugJSON() {
    return {
      type: "number",
      index: this.index,
      valueStr: this.valueStr,
      startTime: this.startTime,
      endTime: this.endTime,
      length: this.length,
      displays: Object.fromEntries(
        Object.entries(this.displays).map(([k, d]) => [k, d.toDebugJSON()])
      )
    };
  }
}

// ============================================================
// Laegna helpers
// ============================================================

const L_W = "W";
const L_I = "I";
const L_O = "O";
const L_A = "A";
const L_E = "E";
const L_INF = "∩";
const L_U = "U";
const L_V = "V";

// FREQUENTIAL complex table (base-16 from IOAE pairs)
const COMPLEX_TABLE = {
  I: { I: "K", O: "J", A: "I", E: "L" },
  O: { I: "Q", O: "P", A: "O", E: "R" },
  A: { I: "C", O: "B", A: "A", E: "D" },
  E: { I: "G", O: "F", A: "E", E: "H" }
};

function repeatLaegna(ch, R) {
  return ch.repeat(R);
}

// IOAE^R, lexicographic
function enumerateIOAE(R) {
  const digits = [L_I, L_O, L_A, L_E];
  const result = [];
  function rec(prefix, depth) {
    if (depth === R) {
      result.push(prefix);
      return;
    }
    for (const d of digits) rec(prefix + d, depth + 1);
  }
  rec("", 0);
  return result;
}

// OA^R, lexicographic (base-2)
function enumerateOA(R) {
  const digits = [L_O, L_A];
  const result = [];
  function rec(prefix, depth) {
    if (depth === R) {
      result.push(prefix);
      return;
    }
    for (const d of digits) rec(prefix + d, depth + 1);
  }
  rec("", 0);
  return result;
}

// FREQUENTIAL: 4^R real IOAE + W… at start, ∩… at end, U… and V… in center
function buildFrequentialSequence(R) {
  const seq = [];
  const w = repeatLaegna(L_W, R);
  const u = repeatLaegna(L_U, R);
  const v = repeatLaegna(L_V, R);
  const inf = repeatLaegna(L_INF, R);

  const reals = enumerateIOAE(R);
  const half = reals.length / 2;

  seq.push({ main: w, kind: "minusInfinity", realIndex: -1 });

  for (let i = 0; i < half; i++) {
    seq.push({ main: reals[i], kind: "real", realIndex: i });
  }

// FREQUENTIAL
seq.push({ main: v, kind: "zeroNeg", realIndex: -1 });
seq.push({ main: u, kind: "zeroPos", realIndex: -1 });

  for (let i = half; i < reals.length; i++) {
    seq.push({ main: reals[i], kind: "real", realIndex: i });
  }

  seq.push({ main: inf, kind: "plusInfinity", realIndex: -1 });

  return seq;
}

// OCTAVIAN: 2^R real OA + W… at start, ∩… at end, U… and V… in center
function buildBinarySequence(R) {
  const seq = [];
  const w = repeatLaegna(L_W, R);
  const u = repeatLaegna(L_U, R);
  const v = repeatLaegna(L_V, R);
  const inf = repeatLaegna(L_INF, R);

  const reals = enumerateOA(R);
  const half = reals.length / 2;

  seq.push({ main: w, kind: "minusInfinity", realIndex: -1 });

  for (let i = 0; i < half; i++) {
    seq.push({ main: reals[i], kind: "real", realIndex: i });
  }

// OCTAVIAN
seq.push({ main: v, kind: "zeroNeg", realIndex: -1 });
seq.push({ main: u, kind: "zeroPos", realIndex: -1 });

  for (let i = half; i < reals.length; i++) {
    seq.push({ main: reals[i], kind: "real", realIndex: i });
  }

  seq.push({ main: inf, kind: "plusInfinity", realIndex: -1 });

  return seq;
}

// FREQUENTIAL complex from IOAE (even length, base-16 Laegna hex)
function buildComplexFromIOAE(ioaeStr) {
  const chars = ioaeStr.split("");
  if (chars.length % 2 !== 0) return "";
  let out = "";
  for (let i = 0; i < chars.length; i += 2) {
    const hi = chars[i];
    const lo = chars[i + 1];
    if (!COMPLEX_TABLE[hi] || !COMPLEX_TABLE[hi][lo]) return "";
    out += COMPLEX_TABLE[hi][lo];
  }
  return out;
}

// OCTAVIAN COMPLEX (base-2 → base-4 IOAE)
// Two OA digits → one IOAE digit.
// Specials collapse exactly the same way.
// NO base-16 complex table is used here.
function buildOctavianComplexFromOA(str, R) {
  if (R % 2 !== 0) return ""; // only even R (2,4) produce complex digits

  let out = "";

  for (let i = 0; i < str.length; i += 2) {
    const hi = str[i];
    const lo = str[i + 1];

    // SPECIALS: identical pairs collapse to single special
    if (hi === lo && (hi === "U" || hi === "V" || hi === "W" || hi === "∩")) {
      out += hi; // UU→U, VV→V, WW→W, ∩∩→∩
      continue;
    }

    // REAL OA pairs → IOAE
    const pair = hi + lo;
    if (pair === "OO") { out += "I"; continue; }
    if (pair === "OA") { out += "O"; continue; }
    if (pair === "AO") { out += "A"; continue; }
    if (pair === "AA") { out += "E"; continue; }

    // FALLBACK: mixed special pair → collapse to first char
    out += hi;
  }

  return out;
}

// Binary logic from OA string
function buildBinaryLogicFromOA(str, R) {
  if (R === 1) {
    const ch = str[0];
    if (ch === L_O) return "False";
    if (ch === L_A) return "True";
    return "";
  }
  if (R >= 2) {
    const hi = str[0];
    const lo = str[1];
    const pair = hi + lo; // OO, OA, AO, AA
    switch (pair) {
      case "OO": return "False-False";
      case "OA": return "False-True";
      case "AO": return "True-False";
      case "AA": return "True-True";
      default: return "";
    }
  }
  return "";
}

// Laegna Logecs Truth Values (meaning + description) by first letter
function laegnaLogecsForFirstLetter(ch) {
  switch (ch) {
    case "W":
      return {
        meaning: "∩Y-higher-exponential",
        description: "Heaven's gate; +∞ (higher exponential boundary)"
      };
    case "I":
      return {
        meaning: "Negotion No",
        description: "X-linear, −2 (deep negative assertion)"
      };
    case "O":
      return {
        meaning: "Negation Ne",
        description: "X-linear, −1 (simple negative assertion)"
      };
    case "V":
      return {
        meaning: "Uneton Un (y-unknown)",
        description: "Unknown ±1 (y-axis uncertainty)"
      };
    case "U":
      return {
        meaning: "Uneton Un (z-unknown)",
        description: "Unknown ±2 (z-axis uncertainty)"
      };
    case "A":
      return {
        meaning: "Position To",
        description: "X-linear, +1 (simple positive assertion)"
      };
    case "E":
      return {
        meaning: "Posetion Po",
        description: "X-linear, +2 (strong positive assertion)"
      };
    case "∩":
      return {
        meaning: "∩Z-lower-logarithmic",
        description: "Hell's puzzled; +∞ (lower logarithmic boundary)"
      };
    default:
      return { meaning: "", description: "" };
  }
}

// Signed value from real index (no zeros), symmetric, skipping 0
function computeSignedValue(realCount, realIndex) {
  if (realIndex < 0) return null;
  const half = realCount / 2;
  let temp = realIndex - half;
  if (temp >= 0) temp += 1;
  return temp;
}

// Unsigned value 0..realCount+2 including specials
function computeUnsignedValue(realCount, kind, realIndex, R, label) {
  // ZERO (W…)
  if (label === "W".repeat(R)) {
    return 0;
  }

  // REAL NATURALS (1..T)
  if (kind === "real") {
    return realIndex + 1;
  }

  // ZERO NEG and ZERO POS do NOT exist as unsigned naturals
  if (kind === "zeroNeg" || kind === "zeroPos") {
    return null; // hide
  }

  // U… and V… do NOT exist as unsigned naturals
  if (label[0] === "U" || label[0] === "V") {
    return null; // hide
  }

  // FINAL +2∞ (∩…)
  if (label[0] === "∩") {
    return Infinity; // displayed as +2∞
  }

  // fallback
  return null;
}

// ============================================================
// SheepNumberSystem – Laegna-aware
// ============================================================

class SheepNumberSystem extends SheepBlock {
  constructor(typeCode, rCode) {
    super();
    this.typeCode = typeCode; // FREQUENTIAL or OCTAVIAN
    this.rCode = rCode;       // R0..R3 => R=1..4
    this.paddingBefore = new SheepPadding(0.0);
    this.paddingAfter = new SheepPadding(0.0);
    this.numbers = [];
    this.numberStartTimes = [];
    this._initNumbers();
    this._buildIndex();
  }

  _rFromCode() {
    const idx = parseInt(this.rCode.replace("R", ""), 10);
    return isNaN(idx) ? 1 : (idx + 1);
  }

  _durationForR() {
    const R = this._rFromCode();
    return 1.0 / R;
  }

  _initNumbers() {
    const R = this._rFromCode();
    const baseDuration = this._durationForR();
    const evenR = (R % 2 === 0);

    let seq;
    if (this.typeCode === "FREQUENTIAL") {
      seq = buildFrequentialSequence(R);
    } else if (this.typeCode === "OCTAVIAN") {
      seq = buildBinarySequence(R);
    } else {
      this._initFallbackNumbers();
      return;
    }

    const base = this.typeCode === "FREQUENTIAL" ? 4 : 2;
    const realCount = Math.pow(base, R);
    const T = realCount;
    const S = -(realCount / 2) - 1;

    const signedMin = -(realCount / 2) - 2;
    const signedMax = (realCount / 2) + 2;
    const unsignedMin = 0;
    const unsignedMax = realCount + 2;

    this.numbers = [];
    let index = 0;

    for (const item of seq) {
      const mainLabel = item.main;
      const num = new SheepNumber(this, index, mainLabel, baseDuration);

      // MAIN DISPLAY
      num.displays.dm.set("Laegna Natural Numbers", mainLabel, true);

      // SECONDARY default
      num.displays.ds.visible = false;
      num.displays.ds.title = "";
      num.displays.ds.content = "";
      num.displays.ds.meaning = "";
      num.displays.ds.description = "";

      const firstChar = mainLabel[0];

      // FREQUENTIAL: attach Logecs meaning/description to MAIN
      if (this.typeCode === "FREQUENTIAL") {
        const logecs = laegnaLogecsForFirstLetter(firstChar);
        num.displays.dm.setMeaning(logecs.meaning, logecs.description);
      }

      // d0: RTS
      const rStr = `R=${R}`;
      const tStr = `T=${T}`;
const Sabs = (realCount / 2) + 1;
const sStr = `S=±0↦${Sabs}↦${T+4}`;
      num.displays.d0.set("RTS", `${rStr} ${tStr} ${sStr}`, true);

      // d1: Position scale (signed)
      let signedVal = null;
      if (item.kind === "real") {
        signedVal = computeSignedValue(realCount, item.realIndex);
      } else if (item.kind === "minusInfinity") {
        signedVal = "-∞";
      } else if (item.kind === "plusInfinity") {
        signedVal = "+∞";
      } else if (item.kind === "zeroNeg") {
        signedVal = "-0";
      } else if (item.kind === "zeroPos") {
        signedVal = "+0";
      }
      const posTitle = `${signedMin}..${signedMax}`;
let signedText = "";
if (signedVal !== null) {
  if (typeof signedVal === "number" && signedVal > 0) {
    signedText = "+" + signedVal;
  } else {
    signedText = String(signedVal);
  }
}
num.displays.d1.set("Position scale", signedText, true);
      num.displays.d1.title = posTitle;

// d2: Posetion scale (unsigned)
const unsignedVal = computeUnsignedValue(realCount, item.kind, item.realIndex, R, mainLabel);

let d2Title = `${unsignedMin}..${unsignedMax}`;
let d2Content;
let d2Visible = true;

// Special overrides for U… and V… (unnatural zeros)
if (mainLabel[0] === "V") {
  // -0 / zeroNeg
  d2Title = "Unnatural #";
  d2Content = "log";
} else if (mainLabel[0] === "U") {
  // +0 / zeroPos
  d2Title = "Unnatural #";
  d2Content = "exp";
} else {
  // Normal unsigned behavior
  if (unsignedVal === Infinity) {
    d2Content = "+2∞";
  } else if (unsignedVal != null) {
    d2Content = String(unsignedVal);
  } else {
    d2Content = "";
    d2Visible = false;
  }
}

num.displays.d2.set(d2Title, d2Content, d2Visible);
num.displays.d2.title = d2Title;

      // FREQUENTIAL secondary (complex / specials)
      if (this.typeCode === "FREQUENTIAL") {
        if (item.kind === "minusInfinity" && evenR) {
          const half = repeatLaegna(L_W, R / 2);
          num.displays.ds.set("Boundary (−∞)", half, true);
        } else if (item.kind === "zeroNeg" && evenR) {
          const half = repeatLaegna(L_U, R / 2);
          num.displays.ds.set("Zero Variant (−0)", half, true);
        } else if (item.kind === "zeroPos" && evenR) {
          const half = repeatLaegna(L_V, R / 2);
          num.displays.ds.set("Zero Variant (+0)", half, true);
        } else if (item.kind === "plusInfinity" && evenR) {
          const half = repeatLaegna(L_INF, R / 2);
          num.displays.ds.set("Boundary (+∞)", half, true);
        } else if (item.kind === "real" && evenR && /^[IOAE]+$/.test(mainLabel)) {
          const complex = buildComplexFromIOAE(mainLabel);
          if (complex) {
            num.displays.ds.set(
              "Complex Natural Laegna Number, half-digits",
              complex,
              true
            );
          } else {
            const logecs = laegnaLogecsForFirstLetter(firstChar);
            if (logecs.meaning) {
              num.displays.ds.set("Laegna Logecs", logecs.meaning, true);
              num.displays.ds.setMeaning(
                logecs.meaning,
                logecs.description
              );
            }
          }
        }
      }

      // OCTAVIAN secondary (IOAE complex + logic in title) – for ALL items when R even
      if (this.typeCode === "OCTAVIAN" && evenR) {
        const complex = buildOctavianComplexFromOA(mainLabel, R);
        const logic = buildBinaryLogicFromOA(mainLabel, R);
        let title = "Laegna Natural Complex";
        if (logic) title += " — " + logic;
        num.displays.ds.set(title, complex, true);
      }

// --- OCTAVIAN meaning/description for MAIN SCREEN (dm) ---
if (this.typeCode === "OCTAVIAN") {
  const str = mainLabel;

  // R = 1 (single digit)
  if (R === 1) {
    if (str === "O") {
      num.displays.dm.setMeaning("Bad takes place", "False");
    } else if (str === "A") {
      num.displays.dm.setMeaning("Good takes place", "True");
    }
  }

  // R >= 2 (use first two digits)
  else if (R >= 2) {
    const pair = str.slice(0, 2);

    if (pair === "OO") {
      num.displays.dm.setMeaning("Disillusion Bad (I)", "False-False");
    } else if (pair === "OA") {
      num.displays.dm.setMeaning("Illusion Bad (O)", "False-True");
    } else if (pair === "AO") {
      num.displays.dm.setMeaning("Real Good (A)", "True-False");
    } else if (pair === "AA") {
      num.displays.dm.setMeaning("Illusion Good Hope (E)", "True-True");
    }
  }
}

      // For odd R, hide ds entirely (both systems)
      if (!evenR) {
        num.displays.ds.visible = false;
      }

      this.numbers.push(num);
      index++;
    }
  }

  _initFallbackNumbers() {
    const count = 11;
    const baseDuration = 1.0;
    for (let i = 0; i < count; i++) {
      const valueStr = String(i);
      const num = new SheepNumber(this, i, valueStr, baseDuration);
      num.displays.dm.set("Laegna Natural Numbers", valueStr, true);
      num.displays.ds.set("Secondary", "", false);
      this.numbers.push(num);
    }
  }

  _buildIndex() {
    let t = 0;
    this.numberStartTimes = [];
    for (const num of this.numbers) {
      num.setStartTime(t);
      this.numberStartTimes.push(t);
      t += num.getLength();
    }
    this.length = this.paddingBefore.length + t + this.paddingAfter.length;
  }

  setStartTime(t) {
    super.setStartTime(t);
    let cursor = this.startTime + this.paddingBefore.length;
    this.paddingBefore.setStartTime(this.startTime);
    for (const num of this.numbers) {
      num.setStartTime(cursor);
      cursor += num.getLength();
    }
    this.paddingAfter.setStartTime(cursor);
  }

  getNumberAtTime(t) {
    if (!this.containsTime(t)) return null;
    const local = t - this.startTime - this.paddingBefore.length;
    if (
      local < 0 ||
      local >= (this.length - this.paddingBefore.length - this.paddingAfter.length)
    ) {
      return null;
    }
    for (const num of this.numbers) {
      if (num.containsTime(t)) {
        return { number: num, localTime: t - num.startTime };
      }
    }
    return null;
  }

  toDebugJSON() {
    return {
      type: "numberSystem",
      typeCode: this.typeCode,
      rCode: this.rCode,
      startTime: this.startTime,
      endTime: this.endTime,
      length: this.length,
      paddingBefore: this.paddingBefore.toDebugJSON(),
      paddingAfter: this.paddingAfter.toDebugJSON(),
      numbers: this.numbers.map(n => n.toDebugJSON())
    };
  }
}

// ============================================================
// Chapters, TOC, and global SheepCounter
// ============================================================

class SheepSubChapter extends SheepBlock {
  constructor(mainChapter, typeCode, rCode, displayRName) {
    super();
    this.mainChapter = mainChapter;
    this.typeCode = typeCode;
    this.rCode = rCode;
    this.displayRName = displayRName;
    this.paddingBefore = new SheepPadding(0.0);
    this.paddingAfter = new SheepPadding(0.0);
    this.system = null;
  }
  initSystem(system) {
    this.system = system;
    this.length = this.paddingBefore.length + system.length + this.paddingAfter.length;
  }
  setStartTime(t) {
    super.setStartTime(t);
    this.paddingBefore.setStartTime(this.startTime);
    const sysStart = this.startTime + this.paddingBefore.length;
    this.system.setStartTime(sysStart);
    const afterStart = sysStart + this.system.length;
    this.paddingAfter.setStartTime(afterStart);
  }
  getNumberAtTime(t) {
    if (!this.containsTime(t)) return null;
    if (!this.system) return null;
    const res = this.system.getNumberAtTime(t);
    if (!res) return null;
    return {
      subChapter: this,
      number: res.number,
      localTimeInNumber: res.localTime
    };
  }
  toDebugJSON() {
    return {
      type: "subChapter",
      typeCode: this.typeCode,
      rCode: this.rCode,
      displayRName: this.displayRName,
      startTime: this.startTime,
      endTime: this.endTime,
      length: this.length,
      paddingBefore: this.paddingBefore.toDebugJSON(),
      paddingAfter: this.paddingAfter.toDebugJSON(),
      system: this.system ? this.system.toDebugJSON() : null
    };
  }
}

class SheepMainChapter extends SheepBlock {
  constructor(typeCode, displayName) {
    super();
    this.typeCode = typeCode;
    this.displayName = displayName;
    this.paddingBefore = new SheepPadding(0.0);
    this.paddingAfter = new SheepPadding(0.0);
    this.subChapters = [];
  }
  addSubChapter(sub) {
    this.subChapters.push(sub);
  }
  buildTimeline() {
    let t = this.startTime + this.paddingBefore.length;
    this.paddingBefore.setStartTime(this.startTime);
    for (const sub of this.subChapters) {
      sub.setStartTime(t);
      t += sub.length;
    }
    this.paddingAfter.setStartTime(t);
    this.length =
      this.paddingBefore.length +
      this.subChapters.reduce((acc, s) => acc + s.length, 0) +
      this.paddingAfter.length;
    this.endTime = this.startTime + this.length;
  }
  getNumberAtTime(t) {
    if (!this.containsTime(t)) return null;
    for (const sub of this.subChapters) {
      const res = sub.getNumberAtTime(t);
      if (res) {
        return {
          mainChapter: this,
          subChapter: res.subChapter,
          number: res.number,
          localTimeInNumber: res.localTimeInNumber
        };
      }
    }
    return null;
  }
  toDebugJSON() {
    return {
      type: "mainChapter",
      typeCode: this.typeCode,
      displayName: this.displayName,
      startTime: this.startTime,
      endTime: this.endTime,
      length: this.length,
      paddingBefore: this.paddingBefore.toDebugJSON(),
      paddingAfter: this.paddingAfter.toDebugJSON(),
      subChapters: this.subChapters.map(s => s.toDebugJSON())
    };
  }
}

class SheepTOC {
  constructor() {
    this.mainDefs = [];
    this._initDefs();
  }
  _initDefs() {
    const types = [
      { typeCode: "FREQUENTIAL", displayName: "Frequential Laegnans (base-4)" },
      { typeCode: "OCTAVIAN", displayName: "Octavian Laegnans (base-2)" }
    ];
    const rCodes = [
      { rCode: "R0", displayRName: "R=1" },
      { rCode: "R1", displayRName: "R=2" },
      { rCode: "R2", displayRName: "R=3" },
      { rCode: "R3", displayRName: "R=4" }
    ];
    for (const t of types) {
      this.mainDefs.push({
        typeCode: t.typeCode,
        displayName: t.displayName,
        rDefs: rCodes.map(r => ({
          rCode: r.rCode,
          displayRName: r.displayRName
        }))
      });
    }
  }
  getDefs() {
    return this.mainDefs;
  }
}

class SheepCounter extends SheepBlock {
  constructor() {
    super();
    this.paddingBefore = new SheepPadding(0.0);
    this.paddingAfter = new SheepPadding(0.0);
    this.toc = new SheepTOC();
    this.mainChapters = [];
    this._initChapters();
    this._buildTimeline();
  }

  _initChapters() {
    const defs = this.toc.getDefs();
    for (const mainDef of defs) {
      const main = new SheepMainChapter(mainDef.typeCode, mainDef.displayName);
      for (const rDef of mainDef.rDefs) {
        const sub = new SheepSubChapter(
          main,
          mainDef.typeCode,
          rDef.rCode,
          rDef.displayRName
        );
        const system = new SheepNumberSystem(mainDef.typeCode, rDef.rCode);
        sub.initSystem(system);
        main.addSubChapter(sub);
      }
      this.mainChapters.push(main);
    }
  }

  _buildTimeline() {
    let t = this.startTime + this.paddingBefore.length;
    this.paddingBefore.setStartTime(this.startTime);
    for (const main of this.mainChapters) {
      main.setStartTime(t);
      main.buildTimeline();
      t += main.length;
    }
    this.paddingAfter.setStartTime(t);
    this.length =
      this.paddingBefore.length +
      this.mainChapters.reduce((acc, m) => acc + m.length, 0) +
      this.paddingAfter.length;
    this.endTime = this.startTime + this.length;
  }

  getTotalLength() {
    return this.length;
  }

  getTOCStructure() {
    return this.mainChapters.map(main => ({
      typeCode: main.typeCode,
      displayName: main.displayName,
      mainChapter: main,
      subChapters: main.subChapters.map(sub => ({
        rCode: sub.rCode,
        displayRName: sub.displayRName,
        subChapter: sub
      }))
    }));
  }

  getNumberAtTime(t) {
    if (!this.containsTime(t)) return null;
    for (const main of this.mainChapters) {
      const res = main.getNumberAtTime(t);
      if (res) {
        return {
          mainChapter: res.mainChapter,
          subChapter: res.subChapter,
          number: res.number,
          localTimeInNumber: res.localTimeInNumber
        };
      }
    }
    return null;
  }

  getChapterStartTime(typeCode, rCode) {
    for (const main of this.mainChapters) {
      if (main.typeCode !== typeCode) continue;
      for (const sub of main.subChapters) {
        if (sub.rCode === rCode) {
          return sub.startTime;
        }
      }
    }
    return null;
  }

  toDebugJSON() {
    return {
      type: "counter",
      startTime: this.startTime,
      endTime: this.endTime,
      length: this.length,
      paddingBefore: this.paddingBefore.toDebugJSON(),
      paddingAfter: this.paddingAfter.toDebugJSON(),
      mainChapters: this.mainChapters.map(m => m.toDebugJSON())
    };
  }
}

window.SheepCounter = SheepCounter;
