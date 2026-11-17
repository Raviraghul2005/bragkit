"use client";

import type { PointerEvent } from "react";
import { root, type BaseProps, type Tone, type ToneProps } from "../../internal/base";
import { tiltToward, untilt } from "../../internal/hooks";

export type PinIcon = "star" | "bolt" | "heart" | "rocket" | "code" | "flag" | "crown" | "check" | "flame" | "globe";
export type PinShape = "round" | "shield" | "square";

export interface Pin {
  /** What the pin is for: "First open-source PR". Shown on hover. */
  label: string;
  /** A small line drawing on the enamel. Without it the pin shows the label's first letters. */
  icon?: PinIcon;
  /** Enamel colour. Default: the next colour in turn. */
  tone?: Tone;
  /** Default: the next shape in turn. */
  shape?: PinShape;
  /** Makes the pin a link. */
  href?: string;
}

export interface TrophyCaseProps extends BaseProps, ToneProps {
  /** The pins on the board. */
  pins?: readonly Pin[];
  /** Small label under the board. Default "Trophy case". */
  caption?: string;
}

// 24 by 24, drawn with a 1.5 stroke.
const ICONS: Record<PinIcon, string> = {
  star: "M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z",
  bolt: "M13 2.5L5 13.5h6l-1 8 8-11h-6z",
  heart: "M12 20s-7.5-4.4-7.5-10A4.3 4.3 0 0112 7.4 4.3 4.3 0 0119.5 10c0 5.6-7.5 10-7.5 10z",
  rocket: "M12 3c3.2 2.4 4.5 5.8 3.5 10.5h-7C7.5 8.8 8.8 5.4 12 3zM8.5 13.5L6 17h3M15.5 13.5L18 17h-3M10.5 17.5L12 21l1.5-3.5M12 9.2v.1",
  code: "M8.5 7.5L4 12l4.5 4.5M15.5 7.5L20 12l-4.5 4.5M13.5 5l-3 14",
  flag: "M6 21V4M6 4.5c4-2 6 2 12 0v8.5c-6 2-8-2-12 0",
  crown: "M4 8.5l3.5 3.5L12 5.5l4.5 6.5L20 8.5l-1.5 9h-13zM6 20.5h12",
  check: "M4.5 12.5l5 5 10-11",
  flame: "M12 21c-3.6 0-6-2.4-6-5.6 0-3 2.2-4.4 3-7.4 1.2 1 1.8 2.2 2 3.5C12.5 9.5 13 6.5 12 3c4 2.5 6 6.5 6 11.5 0 3.9-2.4 6.5-6 6.5z",
  globe: "M12 3.5a8.5 8.5 0 100 17 8.5 8.5 0 000-17zM3.5 12h17M12 3.5c2.5 2.5 3.5 5.3 3.5 8.5s-1 6-3.5 8.5c-2.5-2.5-3.5-5.3-3.5-8.5S9.5 6 12 3.5z",
};

const TONES: Tone[] = ["cobalt", "rose", "apricot", "lilac", "plain", "mint"];
const SHAPES: PinShape[] = ["round", "shield", "square"];
const DEFAULT_PINS: Pin[] = [
  { label: "First ship", icon: "rocket" },
  { label: "100 stars", icon: "star" },
  { label: "Fixed it on a Friday", icon: "bolt" },
];

const letters = (label: string) =>
  (label.match(/[A-Za-z0-9]+/g) ?? [label])
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

/**
 * No. 010 · Trophy Case. Enamel pins on a felt board. Each pin tilts toward the pointer.
 *
 * ```tsx
 * <TrophyCase pins={[{ label: "First open-source PR", icon: "code" }, { label: "100 stars", icon: "star" }]} />
 * ```
 */
export function TrophyCase({ pins = DEFAULT_PINS, caption = "Trophy case", tone = "mint", ...base }: TrophyCaseProps) {
  const move = (e: PointerEvent<HTMLUListElement>) => {
    const pin = (e.target as HTMLElement).closest<HTMLElement>(".bk-tc-pin");
    for (const other of e.currentTarget.querySelectorAll<HTMLElement>(".bk-tc-pin")) if (other !== pin) untilt(other);
    if (pin) tiltToward(pin, e, 18);
  };
  const leave = (e: PointerEvent<HTMLUListElement>) => {
    for (const pin of e.currentTarget.querySelectorAll<HTMLElement>(".bk-tc-pin")) untilt(pin);
  };

  return (
    <div {...root("trophy-case", { ...base, tone })} role="group" aria-label={caption}>
      <div className="bk-tc-frame">
        <ul className="bk-tc-felt" onPointerMove={move} onPointerLeave={leave}>
          {pins.map((pin, i) => {
            const inside = (
              <>
                <span className="bk-tc-enamel" aria-hidden="true">
                  {pin.icon && ICONS[pin.icon] ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={ICONS[pin.icon]} />
                    </svg>
                  ) : (
                    <span className="bk-tc-letters">{letters(pin.label)}</span>
                  )}
                  <span className="bk-tc-glint" />
                </span>
                <span className="bk-sr">{pin.label}</span>
              </>
            );
            const props = {
              className: "bk-tc-pin",
              "data-pin": pin.tone ?? TONES[i % TONES.length],
              "data-shape": pin.shape ?? SHAPES[i % SHAPES.length],
            };
            return (
              <li key={`${pin.label}-${i}`} className="bk-has-tip">
                {pin.href ? (
                  <a {...props} href={pin.href}>
                    {inside}
                  </a>
                ) : (
                  <span {...props}>{inside}</span>
                )}
                <span className="bk-tip" aria-hidden="true">
                  {pin.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      <span className="bk-label bk-tc-label">
        {caption}
        <span>
          {pins.length} {pins.length === 1 ? "pin" : "pins"}
        </span>
      </span>
    </div>
  );
}
