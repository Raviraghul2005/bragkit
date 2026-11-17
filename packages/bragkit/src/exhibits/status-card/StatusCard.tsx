"use client";

import { useEffect, useMemo, useState } from "react";
import { clamp, root, type BaseProps, type ToneProps } from "../../internal/base";
import { Flap } from "../../internal/Flap";
import { useReveal } from "../../internal/hooks";
import { boardLines, flapChar, settleTick } from "./board";

export interface StatusCardProps extends BaseProps, ToneProps {
  /** What you are working on. It is set in capitals on the board. Default "Something new". */
  title?: string;
  /** A short line under the board text: "Week 3 · on time". */
  note?: string;
  /** How far along, 0 to 100. Adds a bar and the number. */
  progress?: number;
  /** Small heading on the board. Default "Now building". */
  caption?: string;
  /** Characters per line. Default 12. */
  columns?: number;
  /** Lines on the board. Longer titles are cut. Default 2. */
  rows?: number;
}

const TICK_MS = 48;

/**
 * No. 004 · Status Card. A departures board: split-flap letters that flip into place.
 *
 * ```tsx
 * <StatusCard title="A CLI that names your variables" note="Week 3 · on time" progress={62} />
 * ```
 */
export function StatusCard({
  title = "Something new",
  note,
  progress,
  caption = "Now building",
  columns = 12,
  rows = 2,
  tone = "apricot",
  ...base
}: StatusCardProps) {
  const cols = Math.round(clamp(columns, 6, 24));
  const lines = useMemo(() => boardLines(title, cols, Math.round(clamp(rows, 1, 4))), [title, cols, rows]);
  const cells = lines.length * cols;
  const [ref, phase] = useReveal<HTMLDivElement>();
  // null: every cell shows its own character. A number: the board is still flipping.
  const [tick, setTick] = useState<number | null>(null);

  useEffect(() => {
    if (phase !== "run") return;
    const end = settleTick(cells - 1);
    let t = 0;
    setTick(0);
    const timer = setInterval(() => {
      t += 1;
      if (t > end) {
        clearInterval(timer);
        setTick(null);
      } else setTick(t);
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [phase, cells, title]);

  const pct = progress === undefined ? null : Math.round(clamp(progress, 0, 100));
  const blank = phase === "wait";

  return (
    <div {...root("status-card", { ...base, tone })} ref={ref} role="group" aria-label={`${caption}: ${title}`}>
      <div className="bk-sc-board">
        <div className="bk-sc-head">
          <span className="bk-sc-lamp" aria-hidden="true" />
          <span>{caption}</span>
        </div>
        <div className="bk-sc-lines" aria-hidden="true">
          {lines.map((line, row) => (
            <div className="bk-sc-line" key={row}>
              {Array.from(line, (char, col) => {
                const index = row * cols + col;
                const shown = blank ? " " : tick === null ? char : flapChar(char, index, tick);
                return <Flap key={col} char={shown} />;
              })}
            </div>
          ))}
        </div>
        <span className="bk-sr">{title}</span>
        {note || pct !== null ? (
          <div className="bk-sc-foot">
            <span className="bk-sc-note">{note}</span>
            {pct !== null ? <span className="bk-sc-pct">{pct}%</span> : null}
          </div>
        ) : null}
        {pct !== null ? (
          <div
            className="bk-sc-bar"
            role="progressbar"
            aria-label="Progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
          >
            <span style={{ width: `${pct}%` }} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
