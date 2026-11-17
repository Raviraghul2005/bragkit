"use client";

import { root, type BaseProps, type ToneProps } from "../../internal/base";
import { useReveal } from "../../internal/hooks";

export interface SignatureProps extends BaseProps, ToneProps {
  /** Your name, written in a script face. Default "Your name". */
  name?: string;
  /** Your real signature instead: the `d` of one SVG path. It is drawn as a pen stroke. */
  path?: string;
  /** The viewBox of that path. Default "0 0 300 100". */
  viewBox?: string;
  /** Small line under the signature: a date, a place. */
  note?: string;
  /** Small label. Default "Signed". */
  caption?: string;
}

const FLOURISH = "M18 86 C 74 74, 128 95, 190 82 S 276 70, 286 80";

/** A size that keeps the whole name on the slip. */
export function nameSize(name: string): number {
  return Math.round(Math.max(16, Math.min(40, 430 / Math.max(1, name.length))));
}

/**
 * No. 016 · Signature. It writes itself when it comes into view.
 *
 * ```tsx
 * <Signature name="Ada Lovelace" note="London, 1843" />
 * <Signature path="M10 60 C 40 10, 60 90, 90 50 ..." viewBox="0 0 300 100" />
 * ```
 */
export function Signature({
  name = "Your name",
  path,
  viewBox = "0 0 300 100",
  note,
  caption = "Signed",
  tone = "cobalt",
  ...base
}: SignatureProps) {
  const [ref, phase] = useReveal<HTMLDivElement>(0.6);

  return (
    <div {...root("signature", { ...base, tone })} ref={ref} data-phase={phase}>
      <div className="bk-sg-slip">
        <div className="bk-sg-ink" role="img" aria-label={`${caption}: ${name}`}>
          {path ? (
            <svg className="bk-sg-pen" viewBox={viewBox} fill="none" aria-hidden="true">
              <path className="bk-sg-stroke" d={path} pathLength={1} />
            </svg>
          ) : (
            <>
              <div className="bk-sg-write">
                <svg viewBox="0 0 300 100" aria-hidden="true">
                  <text className="bk-sg-name" x="14" y="66" fontSize={nameSize(name)}>
                    {name}
                  </text>
                </svg>
              </div>
              <svg className="bk-sg-pen bk-sg-under" viewBox="0 0 300 100" fill="none" aria-hidden="true">
                <path className="bk-sg-stroke" d={FLOURISH} pathLength={1} />
              </svg>
            </>
          )}
        </div>
        <div className="bk-sg-foot">
          <span className="bk-sg-x" aria-hidden="true">
            ×
          </span>
          <span className="bk-sg-rule" aria-hidden="true" />
        </div>
        <span className="bk-sg-caption">
          <span>{caption}</span>
          {note ? <span>{note}</span> : null}
        </span>
      </div>
    </div>
  );
}
