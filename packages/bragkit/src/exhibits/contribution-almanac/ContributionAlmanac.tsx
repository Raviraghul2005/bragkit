"use client";

import { useEffect, useMemo, useState, type FocusEvent, type PointerEvent } from "react";
import { root, type BaseProps, type BragStyle, type ToneProps } from "../../internal/base";
import { toDayKey, type DayInput } from "../../internal/days";
import { useReveal } from "../../internal/hooks";
import { useNow } from "../../internal/use-now";
import { WEEKDAYS, buildAlmanac, fetchGitHubContributions, type Almanac, type Contribution, type Day, type Month } from "./almanac";

export type { Contribution } from "./almanac";
export { fetchGitHubContributions } from "./almanac";

export interface ContributionAlmanacProps extends BaseProps, ToneProps {
  /** Your activity: one `{ date, count }` per day. Days that are missing count as zero. */
  data?: readonly Contribution[];
  /**
   * A GitHub username. The almanac then loads that user's public contributions for the last year
   * from github-contributions-api.jogruber.de (a free third-party service, no key) and shows the live dot.
   */
  user?: string;
  /** The last day on the almanac. Default: today with `user`, else the latest day in `data`. */
  end?: DayInput;
  /** How many months, ending with the month of `end`. Default 12. */
  months?: number;
  /** How many months sit side by side when there is room. Fewer fit on a narrow screen. Default 6. */
  perRow?: number | `${number}`;
  /** A link for the corner of the card. Default with `user`: their GitHub profile. */
  href?: string;
  /** What is being counted. Default "contributions". */
  unit?: string;
  /** Small heading. Default "Contributions". */
  caption?: string;
}

type Load = { state: "idle" | "loading" | "error" } | { state: "ready"; data: Contribution[] };
type Focus = { kind: "day"; day: Day } | { kind: "month"; month: Month } | null;

const fmt = (n: number) => n.toLocaleString("en-US");
const dayLabel = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const shortDay = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
const asDate = (key: string) => new Date(`${key}T00:00:00Z`);
const plural = (n: number, one: string, many = `${one}s`) => `${fmt(n)} ${n === 1 ? one : many}`;

/** What the readout line says. Exported for tests. */
export function readout(focus: Focus, almanac: Almanac | null, unit: string): string {
  const singular = unit.replace(/s$/, "");
  if (focus?.kind === "day") {
    const { day } = focus;
    if (day.future) return `${dayLabel.format(asDate(day.key))} · not yet`;
    return `${dayLabel.format(asDate(day.key))} · ${day.count ? plural(day.count, singular, unit) : `no ${unit}`}`;
  }
  if (focus?.kind === "month") {
    const { month } = focus;
    return `${month.long} · ${plural(month.total, singular, unit)} on ${plural(month.activeDays, "day")}`;
  }
  if (!almanac || almanac.busiestWeekday === null) return `No ${unit} yet`;
  return `Busiest on ${WEEKDAYS[almanac.busiestWeekday]}s · active on ${plural(almanac.activeDays, "day")}`;
}

/**
 * No. 009 · Contribution Almanac. A year of activity as a pinned almanac card: twelve months,
 * each with its own total, and the numbers that matter underneath.
 *
 * ```tsx
 * <ContributionAlmanac user="octocat" />
 * <ContributionAlmanac data={[{ date: "2026-11-12", count: 4 }, { date: "2026-11-13", count: 9 }]} />
 * ```
 */
export function ContributionAlmanac({
  data,
  user,
  end,
  months = 12,
  perRow = 6,
  href,
  unit = "contributions",
  caption = "Contributions",
  tone = "mint",
  style,
  ...base
}: ContributionAlmanacProps) {
  const [load, setLoad] = useState<Load>({ state: "idle" });
  const [focus, setFocus] = useState<Focus>(null);
  const [ref, phase] = useReveal<HTMLDivElement>(0.2);
  const now = useNow();

  useEffect(() => {
    if (!user) return;
    let alive = true;
    setLoad({ state: "loading" });
    fetchGitHubContributions(user).then(
      (found) => alive && setLoad({ state: "ready", data: found }),
      () => alive && setLoad({ state: "error" }),
    );
    return () => {
      alive = false;
    };
  }, [user]);

  const today = now ? toDayKey(now, "UTC") : null;
  const source = user ? (load.state === "ready" ? load.data : []) : (data ?? []);
  // The last day: given, or the latest day in the data, or (for a live or empty almanac) today,
  // which only the browser knows. Until then the card shows blank months of the same size.
  const lastDay = end ?? (user ? today : undefined) ?? (source.length ? undefined : today);
  const almanac = useMemo(() => (lastDay === null ? null : buildAlmanac(source, lastDay ?? undefined, months)), [source, lastDay, months]);

  const live = Boolean(user) && load.state === "ready";
  const link = href ?? (user ? `https://github.com/${encodeURIComponent(user)}` : undefined);
  const span = Math.max(1, Math.min(24, Math.round(months)));
  // Only counts that divide twelve months into even rows.
  const cols = [12, 6, 4, 3, 2].find((n) => n <= Math.round(Number(perRow))) ?? 2;

  const days = useMemo(() => {
    const map = new Map<string, Day>();
    for (const m of almanac?.months ?? []) for (const d of m.days) map.set(d.key, d);
    return map;
  }, [almanac]);

  const point = (e: PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const cell = target.closest<HTMLElement>("[data-k]");
    const day = cell ? days.get(cell.dataset.k ?? "") : undefined;
    if (day) return setFocus({ kind: "day", day });
    const block = target.closest<HTMLElement>("[data-m]");
    const month = block ? almanac?.months[Number(block.dataset.m)] : undefined;
    setFocus(month ? { kind: "month", month } : null);
  };
  const focusMonth = (e: FocusEvent<HTMLElement>) => {
    const month = almanac?.months[Number(e.currentTarget.dataset.m)];
    if (month) setFocus({ kind: "month", month });
  };

  const said =
    user && (load.state === "loading" || load.state === "idle")
      ? "Loading from GitHub"
      : user && load.state === "error"
        ? "GitHub data did not load. Try again later."
        : readout(focus, almanac, unit);
  const total = almanac?.total ?? null;
  const period = span === 12 ? "in the last year" : `in ${span} months`;

  return (
    <div
      {...root("contribution-almanac", { ...base, tone })}
      ref={ref}
      data-phase={phase}
      data-per={cols}
      style={{ "--bk-ca-per": cols, ...style } as BragStyle}
    >
      <div className="bk-ca-card">
        <span className="bk-ca-pin" data-side="l" aria-hidden="true" />
        <span className="bk-ca-pin" data-side="r" aria-hidden="true" />

        <div className="bk-ca-head">
          <div className="bk-ca-title">
            <span className="bk-ca-caption">
              {caption}
              {live ? (
                <span className="bk-ca-live">
                  <span className="bk-live-dot" aria-hidden="true" />
                  Live
                </span>
              ) : null}
            </span>
            <span className="bk-ca-total">
              <span className="bk-ca-num">{total === null ? "–" : fmt(total)}</span>
              <span className="bk-ca-unit">
                {unit} {period}
              </span>
            </span>
          </div>
          {link ? (
            <a className="bk-ca-link" href={link}>
              {user ? `@${user}` : "Profile"}
              <span aria-hidden="true"> ↗</span>
            </a>
          ) : null}
        </div>

        <div className="bk-ca-wall">
        <div className="bk-ca-months" onPointerOver={point} onPointerLeave={() => setFocus(null)}>
          {almanac
            ? almanac.months.map((month, mi) => (
                <section
                  className="bk-ca-month"
                  key={month.key}
                  data-m={mi}
                  style={{ "--bk-m": mi } as BragStyle}
                  tabIndex={0}
                  aria-label={`${month.long}: ${plural(month.total, unit.replace(/s$/, ""), unit)} on ${plural(month.activeDays, "day")}`}
                  onFocus={focusMonth}
                  onBlur={() => setFocus(null)}
                >
                  <span className="bk-ca-mhead" aria-hidden="true">
                    <span className="bk-ca-mname">{month.short}</span>
                    <span className="bk-ca-mtotal">{month.total ? fmt(month.total) : ""}</span>
                  </span>
                  <span className="bk-ca-days" aria-hidden="true">
                    {Array.from({ length: month.offset }, (_, i) => (
                      <span className="bk-ca-d" data-blank="" key={`b${i}`} />
                    ))}
                    {month.days.map((day) => (
                      <span
                        className="bk-ca-d"
                        key={day.key}
                        data-k={day.key}
                        data-l={day.future ? undefined : day.level}
                        data-future={day.future ? "" : undefined}
                      />
                    ))}
                  </span>
                </section>
              ))
            : Array.from({ length: span }, (_, mi) => (
                <section className="bk-ca-month" key={mi} aria-hidden="true">
                  <span className="bk-ca-mhead">
                    <span className="bk-ca-mname">&nbsp;</span>
                  </span>
                  <span className="bk-ca-days">
                    {Array.from({ length: 35 }, (_, i) => (
                      <span className="bk-ca-d" data-l="0" key={i} />
                    ))}
                  </span>
                </section>
              ))}
        </div>
        </div>

        <div className="bk-ca-readout">
          <span className="bk-ca-say" aria-live="polite">
            {said}
          </span>
          <span className="bk-ca-legend" aria-hidden="true">
            Less
            {[0, 1, 2, 3, 4].map((l) => (
              <span className="bk-ca-d" data-l={l} key={l} />
            ))}
            More
          </span>
        </div>

        <dl className="bk-ca-stats">
          <div>
            <dt>Longest streak</dt>
            <dd>
              <b>{almanac ? almanac.longestStreak : "–"}</b> {almanac?.longestStreak === 1 ? "day" : "days"}
            </dd>
          </div>
          <div>
            <dt>Current streak</dt>
            <dd>
              <b>{almanac ? almanac.currentStreak : "–"}</b> {almanac?.currentStreak === 1 ? "day" : "days"}
            </dd>
          </div>
          <div>
            <dt>Busiest day</dt>
            <dd>
              <b>{almanac?.busiestDay ? fmt(almanac.busiestDay.count) : "–"}</b>
              {almanac?.busiestDay ? ` on ${shortDay.format(asDate(almanac.busiestDay.key))}` : ""}
            </dd>
          </div>
          <div>
            <dt>Best month</dt>
            <dd>
              <b>{almanac?.bestMonth ? almanac.bestMonth.short : "–"}</b>
              {almanac?.bestMonth ? ` with ${fmt(almanac.bestMonth.total)}` : ""}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
