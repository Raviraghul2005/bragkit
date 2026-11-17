"use client";

import { useEffect, useMemo, useState } from "react";
import { root, type BaseProps, type ToneProps } from "../../internal/base";
import { daysBetween, toDayKey, type DayInput } from "../../internal/days";
import { useNow } from "../../internal/use-now";
import { countStreak, fetchGitHubPushDates, lastDays, shippedDays } from "./logic";

export interface ShippingStreakProps extends BaseProps, ToneProps {
  /** Days you shipped: "YYYY-MM-DD" strings, timestamps or Dates. */
  history?: readonly DayInput[];
  /** The day the streak began. Every day since counts as shipped, so no history is needed. */
  start?: DayInput;
  /** How many tiles are on the wall, seven per row, ending today. Default 28. */
  days?: number;
  /** Show this number instead of the counted streak. */
  count?: number;
  /** GitHub username. Reads public pushes (no key, about the last 90 days) and marks the wall as live. */
  user?: string;
  /** Time zone that decides where one day ends. Default: the visitor's own zone. */
  zone?: string;
  /** Small heading. Default "Shipping streak". */
  caption?: string;
}

type Load = { state: "idle" | "loading" | "error" } | { state: "ready"; dates: string[] };

const dayName = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
const formatDay = (key: string) => dayName.format(new Date(`${key}T00:00:00Z`));

/**
 * No. 002 · Shipping Streak. A wall of tiles, one per day.
 *
 * ```tsx
 * <ShippingStreak start="2026-09-29" />
 * <ShippingStreak history={["2026-11-12", "2026-11-13", "2026-11-14"]} />
 * <ShippingStreak user="octocat" />
 * ```
 */
export function ShippingStreak({
  history,
  start,
  days = 28,
  count,
  user,
  zone,
  caption = "Shipping streak",
  tone = "apricot",
  ...base
}: ShippingStreakProps) {
  const [load, setLoad] = useState<Load>({ state: "idle" });
  const now = useNow();

  useEffect(() => {
    if (!user) return;
    let alive = true;
    setLoad({ state: "loading" });
    fetchGitHubPushDates(user).then(
      (found) => alive && setLoad({ state: "ready", dates: found }),
      () => alive && setLoad({ state: "error" }),
    );
    return () => {
      alive = false;
    };
  }, [user]);

  const today = now ? toDayKey(now, zone) : null;
  const startKey = start === undefined ? null : toDayKey(start, zone);
  const source = user ? (load.state === "ready" ? load.dates : null) : (history ?? []);
  const shipped = useMemo(() => (source ? shippedDays(source, zone) : null), [source, zone]);

  // Until the clock is known (server render), or while GitHub answers, the wall shows a dash and
  // empty sockets of the final size, so nothing moves when the real days arrive.
  const known = today !== null && shipped !== null;
  const tiles = Math.max(1, Math.min(371, Math.round(days)));
  const row = today ? lastDays(today, tiles) : null;
  const sinceStart = today && startKey ? Math.max(0, daysBetween(startKey, today) + 1) : null;
  const isOn = (day: string, index: number) => {
    if (startKey && day >= startKey) return true;
    if (shipped && (history || user)) return shipped.has(day);
    return !startKey && count !== undefined && index >= tiles - count;
  };

  const streak = count ?? (startKey ? sinceStart : known ? countStreak(shipped, today) : null);
  const onCount = row ? row.filter(isOn).length : 0;
  const live = Boolean(user) && load.state === "ready";
  const failed = Boolean(user) && load.state === "error";

  return (
    <div {...root("shipping-streak", { ...base, tone }, "bk-case")} role="group" aria-label={caption}>
      <span className="bk-label bk-ss-head">
        {caption}
        {live ? (
          <span className="bk-ss-live">
            <span className="bk-live-dot" aria-hidden="true" />
            Live
          </span>
        ) : null}
      </span>
      <div className="bk-ss-count">
        <span className="bk-ss-num">{streak ?? "–"}</span>
        <span className="bk-ss-unit">{streak === 1 ? "day" : "days"}</span>
      </div>
      <div className="bk-ss-wall" aria-hidden="true">
        {Array.from({ length: tiles }, (_, i) => {
          const day = row?.[i];
          const on = day ? isOn(day, i) : false;
          return (
            <span
              key={i}
              className="bk-ss-tile bk-has-tip"
              data-on={on ? "" : undefined}
              data-today={day && i === tiles - 1 ? "" : undefined}
            >
              {day ? (
                <span className="bk-tip">
                  {formatDay(day)} · {on ? "shipped" : "quiet"}
                </span>
              ) : null}
            </span>
          );
        })}
      </div>
      {row ? (
        <span className="bk-sr">
          Shipped on {onCount} of the last {tiles} days.
        </span>
      ) : null}
      {failed ? <span className="bk-text">GitHub did not answer. Try again later.</span> : null}
    </div>
  );
}

/** The old name. Use `ShippingStreak`. */
export const Streak = ShippingStreak;
