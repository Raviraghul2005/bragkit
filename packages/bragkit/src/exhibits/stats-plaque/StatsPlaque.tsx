"use client";

import { useEffect, useState } from "react";
import { root, type BaseProps } from "../../internal/base";
import { useReveal } from "../../internal/hooks";
import { countAt, parseStat } from "./count";

export interface Stat {
  /** What the number counts: "Commits". */
  label: string;
  /** The number. Text such as "1.2k", "99%" or "$40" counts up too. */
  value: number | string;
}

export interface StatsPlaqueProps extends BaseProps {
  /** The numbers on the plaque. Two to six fit best. */
  stats?: readonly Stat[];
  /** The line engraved at the top. Default "By the numbers". */
  title?: string;
}

const DEFAULT_STATS: Stat[] = [
  { label: "Years", value: 5 },
  { label: "Projects", value: 12 },
];
const DURATION = 1300;

/**
 * No. 012 · Stats Plaque. An engraved brass plaque. The numbers count up when it comes into view.
 *
 * ```tsx
 * <StatsPlaque stats={[{ label: "Commits", value: 4812 }, { label: "Stars", value: "1.2k" }]} />
 * ```
 */
export function StatsPlaque({ stats = DEFAULT_STATS, title = "By the numbers", ...base }: StatsPlaqueProps) {
  const [ref, phase] = useReveal<HTMLDivElement>();
  // How far the count has run, 0 to 1. The server and reduced motion render the finished numbers.
  const [t, setT] = useState(1);

  useEffect(() => {
    if (phase !== "run") return;
    let frame = 0;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      setT(1 - (1 - p) ** 3);
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  const progress = phase === "wait" ? 0 : phase === "run" ? t : 1;

  return (
    <div {...root("stats-plaque", base)} ref={ref} data-phase={phase}>
      <div className="bk-sp-plate" data-count={stats.length}>
        <span className="bk-sp-title">{title}</span>
        <dl className="bk-sp-grid">
          {stats.map((stat, i) => {
            const full = String(stat.value);
            return (
              <div className="bk-sp-stat" key={`${stat.label}-${i}`}>
                <dd className="bk-sp-num">
                  {/* The finished number holds the space, so nothing shifts while it counts. */}
                  <span className="bk-sr">{full}</span>
                  <span className="bk-sp-ghost" aria-hidden="true">
                    {full}
                  </span>
                  <span className="bk-sp-live" aria-hidden="true">
                    {progress < 1 ? countAt(parseStat(stat.value), progress) : full}
                  </span>
                </dd>
                <dt className="bk-sp-label">{stat.label}</dt>
              </div>
            );
          })}
        </dl>
        <span className="bk-shine" aria-hidden="true" />
      </div>
    </div>
  );
}
