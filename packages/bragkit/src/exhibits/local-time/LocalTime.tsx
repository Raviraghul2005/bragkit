"use client";

import { useMemo } from "react";
import { root, type BaseProps, type BragStyle, type ToneProps } from "../../internal/base";
import { isValidZone, type DayInput } from "../../internal/days";
import { devWarn } from "../../internal/dev";
import { useNow } from "../../internal/use-now";
import { guessActivity, placeFromZone, readClock } from "./logic";
import { skyAt } from "./sky";

export interface LocalTimeProps extends BaseProps, ToneProps {
  /** IANA time zone, such as "Europe/Lisbon". Default: the visitor's own zone. */
  zone?: string;
  /** Place shown under the clock. Default: the city in `zone`. */
  label?: string;
  /** `12h` (with AM/PM) or `24h`. Default `12h`. */
  format?: "12h" | "24h";
  /** Line after the place. Default: a guess from the hour ("asleep, probably"). An empty string hides it. */
  note?: string;
  /** Small heading. Default "Local time". */
  caption?: string;
  /** Show this moment instead of now: a Date, a timestamp or an ISO string. The clock then stands still. */
  at?: DayInput;
}

/**
 * No. 003 · Local Time. A small window with the sky behind it.
 *
 * ```tsx
 * <LocalTime zone="Europe/Lisbon" />
 * ```
 */
export function LocalTime({
  zone,
  label,
  format = "12h",
  note,
  caption = "Local time",
  at,
  tone = "plain",
  ...base
}: LocalTimeProps) {
  const ticking = useNow();
  const fixed = useMemo(() => {
    if (at === undefined) return null;
    const date = at instanceof Date ? at : new Date(at);
    return Number.isNaN(date.getTime()) ? null : date;
  }, [at]);
  const now = fixed ?? ticking;

  const validZone = useMemo(() => {
    if (zone === undefined || isValidZone(zone)) return zone;
    devWarn(`LocalTime: unknown time zone "${zone}", showing the visitor's own.`);
    return undefined;
  }, [zone]);

  // With no zone the place is the visitor's, which only the browser knows; a fixed `at`
  // with a zone can be drawn on the server.
  const ready = now !== null && (fixed === null || validZone !== undefined || ticking !== null);
  const hour12 = format !== "24h";
  const reading = ready && now ? readClock(now, validZone, hour12) : null;
  const sky = reading ? skyAt(reading.minuteOfDay) : null;
  const visitorZone = ticking ? Intl.DateTimeFormat().resolvedOptions().timeZone : undefined;
  const place = label ?? (validZone ? placeFromZone(validZone) : visitorZone ? placeFromZone(visitorZone) : "");
  const activity = note ?? (reading ? guessActivity(reading.hour) : "");
  const line = [place, activity].filter(Boolean).join(" · ");

  const skyStyle: BragStyle | undefined = sky
    ? { "--bk-sky-top": sky.top, "--bk-sky-bottom": sky.bottom, "--bk-stars": sky.stars }
    : undefined;

  return (
    <div {...root("local-time", { ...base, tone })} role="group" aria-label={caption}>
      <div className="bk-lt-window" aria-hidden="true">
        <div className="bk-lt-sky" style={skyStyle} data-ready={sky ? "" : undefined}>
          <span className="bk-lt-stars" />
          {sky ? (
            <span className="bk-lt-orb" data-kind={sky.orb.kind} style={{ left: `${sky.orb.x}%`, top: `${sky.orb.y}%` }} />
          ) : null}
          <span className="bk-lt-land" />
          <span className="bk-lt-glass" />
        </div>
        <span className="bk-lt-bar bk-lt-bar-v" />
        <span className="bk-lt-bar bk-lt-bar-h" />
      </div>
      <div className="bk-lt-sill" aria-hidden="true" />
      <div className="bk-lt-meta">
        <span className="bk-label">{caption}</span>
        <div className="bk-lt-clock">
          {reading && now ? (
            <time dateTime={now.toISOString()}>
              <span className="bk-lt-time">{reading.time}</span>
              {reading.period ? <span className="bk-lt-period">{reading.period}</span> : null}
            </time>
          ) : (
            <span aria-hidden="true">
              <span className="bk-lt-time">--:--</span>
              {hour12 ? <span className="bk-lt-period">AM</span> : null}
            </span>
          )}
        </div>
        {/* A non-breaking space keeps the line's height while the place is still unknown. */}
        <span className="bk-text bk-lt-place">{line || " "}</span>
      </div>
    </div>
  );
}
