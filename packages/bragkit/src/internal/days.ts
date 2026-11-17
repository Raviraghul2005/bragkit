// Calendar days as "YYYY-MM-DD" keys. Keys compare and sort as strings, and day arithmetic
// runs in UTC so daylight saving never adds or loses a day.

export type DayInput = string | number | Date;

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
const formatters = new Map<string, Intl.DateTimeFormat>();

function formatter(zone: string | undefined) {
  const key = zone ?? "";
  let f = formatters.get(key);
  if (!f) {
    // en-CA formats as YYYY-MM-DD.
    f = new Intl.DateTimeFormat("en-CA", {
      timeZone: zone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    formatters.set(key, f);
  }
  return f;
}

/** The calendar day of a moment in a time zone. A bare "YYYY-MM-DD" string is already a day. */
export function toDayKey(input: DayInput, zone?: string): string | null {
  if (typeof input === "string" && DATE_ONLY.test(input)) return input;
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return null;
  return formatter(zone).format(date);
}

export function addDays(key: string, days: number): string {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

/** Whole days from `from` to `to` (positive when `to` is later). */
export function daysBetween(from: string, to: string): number {
  const ms = Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`);
  return Math.round(ms / 86_400_000);
}

/** True when the zone is a time zone this browser knows. */
export function isValidZone(zone: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: zone });
    return true;
  } catch {
    return false;
  }
}
