import { addDays, daysBetween, toDayKey, type DayInput } from "../../internal/days";

export interface Contribution {
  /** The day: "YYYY-MM-DD", a timestamp or a Date. */
  date: DayInput;
  /** How much happened that day. */
  count: number;
}

export interface Day {
  key: string;
  /** 1–31. */
  date: number;
  /** 0 is Sunday. */
  weekday: number;
  count: number;
  /** 0 (nothing) to 4 (one of your busiest days). */
  level: number;
  /** After the last day on the almanac. */
  future: boolean;
}

export interface Month {
  /** "2026-08" */
  key: string;
  /** "Aug" */
  short: string;
  /** "August 2026" */
  long: string;
  /** Empty cells before the 1st, so the 1st sits on its weekday. */
  offset: number;
  days: Day[];
  total: number;
  activeDays: number;
}

export interface Almanac {
  months: Month[];
  /** The last day counted. */
  end: string;
  total: number;
  activeDays: number;
  longestStreak: number;
  currentStreak: number;
  busiestDay: Day | null;
  bestMonth: Month | null;
  /** The weekday with the most activity, 0 is Sunday, or null with no activity. */
  busiestWeekday: number | null;
  /** The four counts where levels 1–4 begin, for the legend. */
  thresholds: number[];
}

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const weekdayOf = (key: string) => new Date(`${key}T00:00:00Z`).getUTCDay();

/** Adds up the days, dropping anything it cannot read. */
export function countsByDay(data: readonly Contribution[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const entry of data) {
    const key = toDayKey(entry.date, "UTC");
    if (!key || !Number.isFinite(entry.count) || entry.count <= 0) continue;
    counts.set(key, (counts.get(key) ?? 0) + entry.count);
  }
  return counts;
}

/** The latest day that has any activity, or null. */
export function latestDay(counts: ReadonlyMap<string, number>): string | null {
  let latest: string | null = null;
  for (const key of counts.keys()) if (!latest || key > latest) latest = key;
  return latest;
}

/** Where levels 1–4 begin: the quartiles of the busy days, as GitHub does it. */
export function levelThresholds(values: readonly number[]): number[] {
  const busy = values.filter((v) => v > 0).sort((a, b) => a - b);
  if (busy.length === 0) return [1, 2, 3, 4];
  const at = (q: number) => busy[Math.min(busy.length - 1, Math.floor(q * busy.length))];
  const t = [1, at(0.25) + 1, at(0.5) + 1, at(0.75) + 1];
  // Keep them rising, so every level is used by at least one count.
  for (let i = 1; i < 4; i += 1) t[i] = Math.max(t[i], t[i - 1] + 1);
  return t;
}

export function levelOf(count: number, thresholds: readonly number[]): number {
  if (count <= 0) return 0;
  let level = 1;
  for (let i = 1; i < 4; i += 1) if (count >= thresholds[i]) level = i + 1;
  return level;
}

/** Lays out the twelve calendar months that end with the month of `end`, and works out the stats. */
export function buildAlmanac(data: readonly Contribution[], end: DayInput | undefined, months = 12): Almanac | null {
  const counts = countsByDay(data);
  const last = (end === undefined ? null : toDayKey(end, "UTC")) ?? latestDay(counts);
  if (!last) return null;

  const [endYear, endMonth] = last.split("-").map(Number);
  const span = Math.max(1, Math.min(24, Math.round(months)));
  const firstKey = `${new Date(Date.UTC(endYear, endMonth - span, 1)).toISOString().slice(0, 7)}-01`;

  // The levels are worked out over the days on show only.
  const shown: number[] = [];
  for (const [key, n] of counts) if (key >= firstKey && key <= last) shown.push(n);
  const thresholds = levelThresholds(shown);

  const out: Month[] = [];
  for (let i = span - 1; i >= 0; i -= 1) {
    const start = new Date(Date.UTC(endYear, endMonth - 1 - i, 1));
    const y = start.getUTCFullYear();
    const m = start.getUTCMonth();
    const length = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
    const prefix = start.toISOString().slice(0, 7);
    const days: Day[] = [];
    let total = 0;
    let activeDays = 0;
    for (let d = 1; d <= length; d += 1) {
      const key = `${prefix}-${String(d).padStart(2, "0")}`;
      const future = key > last;
      const count = future ? 0 : (counts.get(key) ?? 0);
      total += count;
      if (count > 0) activeDays += 1;
      days.push({ key, date: d, weekday: weekdayOf(key), count, level: levelOf(count, thresholds), future });
    }
    out.push({ key: prefix, short: MONTHS_SHORT[m], long: `${MONTHS_LONG[m]} ${y}`, offset: days[0].weekday, days, total, activeDays });
  }

  const all = out.flatMap((m) => m.days).filter((d) => !d.future);
  let longest = 0;
  let run = 0;
  let busiest: Day | null = null;
  const byWeekday = [0, 0, 0, 0, 0, 0, 0];
  for (const day of all) {
    run = day.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
    byWeekday[day.weekday] += day.count;
    if (day.count > 0 && (!busiest || day.count > busiest.count)) busiest = day;
  }
  // A streak that ended yesterday still counts until today is over.
  let current = 0;
  let cursor = counts.get(last) ? last : addDays(last, -1);
  while ((counts.get(cursor) ?? 0) > 0 && cursor >= firstKey) {
    current += 1;
    cursor = addDays(cursor, -1);
  }
  const total = out.reduce((n, m) => n + m.total, 0);
  const bestMonth = out.reduce<Month | null>((best, m) => (m.total > 0 && (!best || m.total > best.total) ? m : best), null);
  const topWeekday = byWeekday.indexOf(Math.max(...byWeekday));

  return {
    months: out,
    end: last,
    total,
    activeDays: all.filter((d) => d.count > 0).length,
    longestStreak: longest,
    currentStreak: current,
    busiestDay: busiest,
    bestMonth,
    busiestWeekday: total > 0 ? topWeekday : null,
    thresholds,
  };
}

/** Plausible invented activity for demos: the same every time, quieter at weekends and in August. */
export function sampleContributions(end: string, days = 365): Contribution[] {
  const out: Contribution[] = [];
  let seed = 20261118;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = addDays(end, -i);
    const weekday = weekdayOf(date);
    const holiday = date.slice(5, 7) === "08" && Number(date.slice(8)) < 18;
    const chance = holiday ? 0.12 : weekday === 0 || weekday === 6 ? 0.32 : 0.78;
    const roll = random();
    const size = random();
    if (roll < chance) out.push({ date, count: 1 + Math.floor(size * size * size * 18) });
  }
  return out;
}

export function daysAgo(from: string, to: string): number {
  return daysBetween(from, to);
}

interface ApiResponse {
  contributions?: Array<{ date: string; count: number }>;
}

const cache = new Map<string, Promise<Contribution[]>>();

/**
 * A GitHub user's contributions for the last year, from github-contributions-api.jogruber.de:
 * a free public service run by a third party, no key needed. It reads the public profile, so
 * private contributions only count if the user shows them on GitHub.
 */
export function fetchGitHubContributions(user: string): Promise<Contribution[]> {
  const key = user.trim().toLowerCase();
  let pending = cache.get(key);
  if (!pending) {
    pending = fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(key)}?y=last`)
      .then((res) => {
        if (!res.ok) throw new Error(`The contributions service answered ${res.status}`);
        return res.json() as Promise<ApiResponse>;
      })
      .then((body) => (body.contributions ?? []).map((c) => ({ date: c.date, count: c.count })));
    pending.catch(() => cache.delete(key));
    cache.set(key, pending);
  }
  return pending;
}
