"use client";

import { useEffect, useState } from "react";
import { clamp, root, type BaseProps, type ToneProps } from "../../internal/base";
import { daysBetween, toDayKey, type DayInput } from "../../internal/days";
import { Flap } from "../../internal/Flap";
import { useReveal } from "../../internal/hooks";
import { useNow } from "../../internal/use-now";

export interface DaysSinceProps extends BaseProps, ToneProps {
  /** The number on the sign. */
  days?: number;
  /** Or the day it last happened: the sign counts the days since, in the visitor's time zone. */
  since?: DayInput;
  /** What it has been days without. Default "an incident". */
  label?: string;
  /** The line on the band at the top. Default "This portfolio has gone". */
  heading?: string;
  /** Adds a reset button that flips the number back to zero for this visitor. Default `false`. */
  resettable?: boolean;
  /** Called when the reset button is pressed. */
  onReset?: () => void;
}

const TICK_MS = 70;

/** The digits a sign shows part-way through flipping up to its number. */
export function flipDigits(target: string, tick: number): string {
  return Array.from(target, (char, i) => {
    const left = 5 + i * 2 - tick;
    return left <= 0 || !/\d/.test(char) ? char : String((Number(char) - left + 20) % 10);
  }).join("");
}

/**
 * No. 021 · Days Since. A factory sign with flip numbers.
 *
 * ```tsx
 * <DaysSince days={47} label="a production incident" />
 * <DaysSince since="2026-09-29" label="rewriting it all in a new framework" />
 * ```
 */
export function DaysSince({
  days,
  since,
  label = "an incident",
  heading = "This portfolio has gone",
  resettable = false,
  onReset,
  tone = "apricot",
  ...base
}: DaysSinceProps) {
  const [ref, phase] = useReveal<HTMLDivElement>(0.6);
  const now = useNow();
  const [wasReset, setWasReset] = useState(false);
  const [tick, setTick] = useState<number | null>(null);

  const today = now ? toDayKey(now) : null;
  const start = since === undefined ? null : toDayKey(since);
  const counted = days ?? (start && today ? Math.max(0, daysBetween(start, today)) : start ? null : 0);
  const value = wasReset ? 0 : counted;
  // Two flaps at least; a dash on each while the date is still unknown (server render).
  const text = value === null ? "––" : String(Math.round(clamp(value, 0, 99999))).padStart(2, "0");

  useEffect(() => setWasReset(false), [days, since]);

  useEffect(() => {
    if (phase !== "run" || value === null) return;
    const end = 5 + (text.length - 1) * 2;
    let t = 0;
    setTick(0);
    const timer = setInterval(() => {
      t += 1;
      if (t >= end) {
        clearInterval(timer);
        setTick(null);
      } else setTick(t);
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [phase, text, value]);

  const shown = phase === "wait" ? text.replace(/\d/g, "0") : tick === null ? text : flipDigits(text, tick);
  const unit = value === 1 ? "day" : "days";

  return (
    <div {...root("days-since", { ...base, tone })} ref={ref}>
      <div className="bk-ds-sign">
        <div className="bk-ds-band">{heading}</div>
        <div className="bk-ds-count" role="img" aria-label={value === null ? "Counting the days" : `${value} ${unit}`}>
          <span className="bk-ds-flaps">
            {Array.from(shown, (char, i) => (
              <Flap key={shown.length - i} char={char} />
            ))}
          </span>
        </div>
        <div className="bk-ds-without">
          <span className="bk-ds-unit">{unit} without</span>
          <span className="bk-ds-what">{label}</span>
        </div>
        {resettable ? (
          <button
            type="button"
            className="bk-ds-reset"
            onClick={() => {
              setWasReset(true);
              onReset?.();
            }}
          >
            Reset
          </button>
        ) : null}
      </div>
    </div>
  );
}
