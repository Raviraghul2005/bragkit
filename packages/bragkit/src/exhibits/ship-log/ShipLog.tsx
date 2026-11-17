"use client";

import { root, type BaseProps, type BragStyle } from "../../internal/base";
import { useReveal } from "../../internal/hooks";

export interface ShipLogEntry {
  /** When it shipped: "2026-11-02" is shown as "2 Nov 2026"; any other text is shown as it is. */
  date: string;
  /** What shipped. */
  title: string;
  /** Makes the title a link. */
  href?: string;
  /** One more line, if it needs one. */
  note?: string;
}

export interface ShipLogProps extends BaseProps {
  /** What you shipped, newest first. */
  entries?: readonly ShipLogEntry[];
  /** Small heading. Default "Ship log". */
  caption?: string;
}

const dayName = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** "2026-11-02" → "2 Nov 2026". Anything else is returned unchanged. */
export function logDate(date: string): string {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? dayName.format(new Date(`${date}T00:00:00Z`)) : date;
}

/**
 * No. 011 · Ship Log. A museum timeline with brass pins.
 *
 * ```tsx
 * <ShipLog entries={[{ date: "2026-11-02", title: "v2.0, the rewrite", href: "/blog/v2" }]} />
 * ```
 */
export function ShipLog({ entries = [], caption = "Ship log", ...base }: ShipLogProps) {
  const [ref, phase] = useReveal<HTMLDivElement>(0.25);

  return (
    <div {...root("ship-log", base)} ref={ref} data-phase={phase}>
      <span className="bk-label bk-sl-head">{caption}</span>
      {entries.length === 0 ? (
        <span className="bk-text bk-sl-empty">Nothing in the log yet.</span>
      ) : (
        <ol className="bk-sl-list">
          {entries.map((entry, i) => (
            <li className="bk-sl-entry" key={`${entry.date}-${i}`} style={{ "--bk-i": i } as BragStyle}>
              <span className="bk-sl-pin" aria-hidden="true" />
              <time className="bk-sl-date" dateTime={/^\d{4}-\d{2}-\d{2}$/.test(entry.date) ? entry.date : undefined}>
                {logDate(entry.date)}
              </time>
              {entry.href ? (
                <a className="bk-sl-title" href={entry.href}>
                  {entry.title}
                </a>
              ) : (
                <span className="bk-sl-title">{entry.title}</span>
              )}
              {entry.note ? <span className="bk-text bk-sl-note">{entry.note}</span> : null}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
