export interface ClockReading {
  /** "02:14" */
  time: string;
  /** "AM" / "PM", or "" on a 24-hour clock. */
  period: string;
  /** 0–23 in the zone. */
  hour: number;
  /** Minutes since midnight in the zone, 0–1439. */
  minuteOfDay: number;
}

export function readClock(now: Date, zone: string | undefined, hour12: boolean): ClockReading {
  const display = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    hour: "2-digit",
    minute: "2-digit",
    hour12,
  }).formatToParts(now);
  const clock = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(now);

  const part = (parts: Intl.DateTimeFormatPart[], type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";

  const hour = Number(part(clock, "hour")) % 24;
  const minute = Number(part(clock, "minute"));
  return {
    time: `${part(display, "hour")}:${part(display, "minute")}`,
    period: hour12 ? part(display, "dayPeriod").toUpperCase() : "",
    hour,
    minuteOfDay: hour * 60 + minute,
  };
}

/** "Europe/Lisbon" → "Lisbon", "America/New_York" → "New York". */
export function placeFromZone(zone: string): string {
  const last = zone.split("/").pop() ?? zone;
  return last.replace(/_/g, " ");
}

/** A dry guess at what someone is doing at this hour. */
export function guessActivity(hour: number): string {
  if (hour < 6) return "asleep, probably";
  if (hour < 9) return "up early";
  if (hour < 18) return "working hours";
  if (hour < 22) return "evening";
  return "up late";
}
