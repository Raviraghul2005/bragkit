"use client";

import { clamp, root, type BaseProps, type BragStyle, type ToneProps } from "../../internal/base";
import { useReveal } from "../../internal/hooks";

export interface HeadCountProps extends BaseProps, ToneProps {
  /** The number on the counter. Default 0. */
  count?: number;
  /** What is being counted. Default "visitors". */
  label?: string;
  /** How many wheels, at least. More are added when the number needs them. Default 5. */
  digits?: number;
  /** Shows the live dot. Set it only when `count` is fed by live data. Default `false`. */
  live?: boolean;
}

const NUMERALS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/** The digits of a count, padded with zeros to at least `wheels` places. */
export function wheelDigits(count: number, wheels: number): number[] {
  const whole = Math.max(0, Math.floor(Number.isFinite(count) ? count : 0));
  return Array.from(String(whole).padStart(Math.round(clamp(wheels, 1, 12)), "0"), Number);
}

/**
 * No. 020 · Head Count. A mechanical counter. The wheels roll when the number changes.
 *
 * ```tsx
 * <HeadCount count={1284} label="visitors" />
 * ```
 */
export function HeadCount({ count = 0, label = "visitors", digits = 5, live = false, tone = "plain", ...base }: HeadCountProps) {
  const [ref, phase] = useReveal<HTMLDivElement>(0.6);
  const target = wheelDigits(count, digits);
  // Off screen the wheels rest at zero, so they roll up to the number as the counter comes into view.
  const shown = phase === "wait" ? target.map(() => 0) : target;
  const whole = Math.max(0, Math.floor(Number.isFinite(count) ? count : 0));

  return (
    <div {...root("head-count", { ...base, tone })} ref={ref} data-phase={phase}>
      <div className="bk-hc-body">
        <span className="bk-hc-plate" aria-hidden="true">
          Count
        </span>
        <div className="bk-hc-window" role="img" aria-label={`${whole.toLocaleString("en-US")} ${label}`}>
          {shown.map((digit, i) => (
            <span className="bk-hc-wheel" key={shown.length - i} aria-hidden="true">
              <span
                className="bk-hc-strip"
                style={{ "--bk-d": digit, "--bk-w": shown.length - 1 - i } as BragStyle}
              >
                {NUMERALS.map((n) => (
                  <span key={n}>{n}</span>
                ))}
              </span>
            </span>
          ))}
        </div>
      </div>
      <span className="bk-label bk-hc-label">
        {label}
        {live ? (
          <span className="bk-hc-live">
            <span className="bk-live-dot" aria-hidden="true" />
            Live
          </span>
        ) : null}
      </span>
    </div>
  );
}
