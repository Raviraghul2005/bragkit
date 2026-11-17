import { addDays, daysBetween, toDayKey, type DayInput } from "../../internal/days";

export interface Contribution {
  /** The day: "YYYY-MM-DD", a timestamp or a Date. */
  date: DayInput;
  /** How much happened that day. */
  count: number;
}

export interface Stitch {
  /** "YYYY-MM-DD", or null for a day after the last one (the unfinished end of the cloth). */
  day: string | null;
  count: number;
  /** 0 (bare thread) to 4 (the richest colour). */
  level: number;
}

export interface Weave {
  /** Seven rows, Sunday first; each has one stitch per week, oldest first. */
  rows: Stitch[][];
  total: number;
}

const weekday = (key: string) => new Date(`${key}T00:00:00Z`).getUTCDay();

/** Lays the days out as cloth: one column per week, ending in the week of the last day. */
export function weave(data: readonly Contribution[], weeks: number, end?: DayInput): Weave {
  const counts = new Map<string, number>();
  let latest: string | null = null;
  for (const entry of data) {
    const key = toDayKey(entry.date, "UTC");
    if (!key || !Number.isFinite(entry.count)) continue;
    counts.set(key, (counts.get(key) ?? 0) + Math.max(0, entry.count));
    if (!latest || key > latest) latest = key;
  }
  const last = (end === undefined ? null : toDayKey(end, "UTC")) ?? latest;
  const columns = Math.max(1, Math.min(53, Math.round(weeks)));
  const rows: Stitch[][] = Array.from({ length: 7 }, () => []);

  if (!last) {
    for (const row of rows) for (let c = 0; c < columns; c += 1) row.push({ day: null, count: 0, level: 0 });
    return { rows, total: 0 };
  }

  // The first Sunday on the cloth.
  const start = addDays(last, -weekday(last) - (columns - 1) * 7);
  let max = 0;
  let total = 0;
  for (let i = 0; i <= daysBetween(start, last); i += 1) {
    const n = counts.get(addDays(start, i)) ?? 0;
    max = Math.max(max, n);
    total += n;
  }
  for (let c = 0; c < columns; c += 1) {
    for (let r = 0; r < 7; r += 1) {
      const day = addDays(start, c * 7 + r);
      if (day > last) rows[r].push({ day: null, count: 0, level: 0 });
      else {
        const count = counts.get(day) ?? 0;
        rows[r].push({ day, count, level: count === 0 ? 0 : Math.max(1, Math.ceil((count / max) * 4)) });
      }
    }
  }
  return { rows, total };
}

/** Plausible invented activity for demos: the same every time, quieter at weekends. */
export function sampleContributions(end: string, weeks: number): Contribution[] {
  const out: Contribution[] = [];
  let seed = 20261114;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  for (let i = weeks * 7 - 1; i >= 0; i -= 1) {
    const date = addDays(end, -i);
    const day = weekday(date);
    const busy = day === 0 || day === 6 ? 0.35 : 0.82;
    const roll = random();
    const size = random();
    if (roll < busy) out.push({ date, count: 1 + Math.floor(size * size * 11) });
  }
  return out;
}
