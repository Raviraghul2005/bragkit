export interface ParsedStat {
  prefix: string;
  /** The number to count to, or null when the value has no number in it. */
  number: number | null;
  suffix: string;
  /** Digits after the decimal point. */
  decimals: number;
  /** Whether the number was written with thousands separators. */
  grouped: boolean;
  text: string;
}

/** Splits "1.2k", "$40", "99%" or 4812 into the part that counts and the parts that stay. */
export function parseStat(value: number | string): ParsedStat {
  const text = String(value);
  const match = /^([^\d-]*)(-?\d[\d,]*(?:\.\d+)?)(.*)$/.exec(text);
  if (!match) return { prefix: "", number: null, suffix: "", decimals: 0, grouped: false, text };
  const digits = match[2];
  const number = Number(digits.replace(/,/g, ""));
  if (!Number.isFinite(number)) return { prefix: "", number: null, suffix: "", decimals: 0, grouped: false, text };
  return {
    prefix: match[1],
    number,
    suffix: match[3],
    decimals: (digits.split(".")[1] ?? "").length,
    grouped: digits.includes(",") || (typeof value === "number" && Math.abs(value) >= 10000),
    text,
  };
}

/** The text of a stat when the count is `t` of the way there (0 to 1). */
export function countAt(stat: ParsedStat, t: number): string {
  if (stat.number === null || t >= 1) return stat.number === null ? stat.text : format(stat, stat.number);
  return format(stat, stat.number * Math.max(0, t));
}

function format(stat: ParsedStat, n: number): string {
  const fixed = n.toFixed(stat.decimals);
  const [whole, fraction] = fixed.split(".");
  const grouped = stat.grouped ? whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : whole;
  return `${stat.prefix}${fraction ? `${grouped}.${fraction}` : grouped}${stat.suffix}`;
}
