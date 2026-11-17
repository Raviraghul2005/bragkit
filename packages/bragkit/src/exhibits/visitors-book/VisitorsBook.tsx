"use client";

import { useState, type FormEvent } from "react";
import { root, type BaseProps, type ToneProps } from "../../internal/base";

export interface BookEntry {
  name: string;
  /** A short message. */
  note?: string;
  /** When they signed: "2026-11-02" is shown as "2 Nov 2026"; any other text is shown as it is. */
  date?: string;
}

export interface VisitorsBookProps extends BaseProps, ToneProps {
  /** The signatures, newest first. */
  entries?: readonly BookEntry[];
  /**
   * Called when a visitor signs. Save the entry wherever you keep them. Without it the book is
   * read-only and shows no form.
   */
  onSign?: (entry: { name: string; note: string }) => void | Promise<void>;
  /** Small heading. Default "Visitors' book". */
  caption?: string;
}

const PER_PAGE = 3;
const dayName = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** "2026-11-02" → "2 Nov 2026", or "2 Nov" when `short`. Anything else is returned unchanged. */
export function bookDate(date: string | undefined, short = false): string {
  if (!date) return "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  const full = dayName.format(new Date(`${date}T00:00:00Z`));
  return short ? full.replace(/ \d{4}$/, "") : full;
}

function Page({ entries, fresh, side }: { entries: readonly BookEntry[]; fresh: boolean; side: "left" | "right" }) {
  return (
    <ol className={`bk-vb-page bk-vb-${side}`}>
      {Array.from({ length: PER_PAGE }, (_, i) => {
        const entry = entries[i];
        return (
          <li key={i} className="bk-vb-entry" data-fresh={fresh && i === 0 && side === "left" ? "" : undefined}>
            {entry ? (
              <>
                <span className="bk-vb-name">{entry.name}</span>
                <span className="bk-vb-note" title={entry.note}>
                  {entry.note}
                </span>
                <span className="bk-vb-date" title={bookDate(entry.date)}>
                  {bookDate(entry.date, true)}
                </span>
              </>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

/**
 * No. 019 · Visitors' Book. An open guest book. New signatures write themselves in; pages turn.
 *
 * ```tsx
 * <VisitorsBook entries={entries} onSign={(entry) => save(entry)} />
 * ```
 */
export function VisitorsBook({ entries = [], onSign, caption = "Visitors' book", tone = "rose", ...base }: VisitorsBookProps) {
  // Signatures added in this visit, shown before the saved ones.
  const [added, setAdded] = useState<BookEntry[]>([]);
  const [spread, setSpread] = useState(0);
  const [turn, setTurn] = useState<{ way: "next" | "prev"; n: number } | null>(null);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  const all = [...added, ...entries];
  const spreads = Math.max(1, Math.ceil(all.length / (PER_PAGE * 2)));
  const at = Math.min(spread, spreads - 1);
  const first = at * PER_PAGE * 2;
  const fresh = added.length > 0 && at === 0;

  const go = (way: "next" | "prev") => {
    setSpread(way === "next" ? at + 1 : at - 1);
    setTurn((t) => ({ way, n: (t?.n ?? 0) + 1 }));
  };

  const sign = (e: FormEvent) => {
    e.preventDefault();
    const entry = { name: name.trim(), note: note.trim() };
    if (!entry.name) return;
    setAdded((list) => [{ ...entry, date: "Just now" }, ...list]);
    setSpread(0);
    setName("");
    setNote("");
    void onSign?.(entry);
  };

  return (
    <div {...root("visitors-book", { ...base, tone })} role="group" aria-label={caption}>
      <div className="bk-vb-book">
        <Page side="left" entries={all.slice(first, first + PER_PAGE)} fresh={fresh} key={`l${added.length}`} />
        <Page side="right" entries={all.slice(first + PER_PAGE, first + PER_PAGE * 2)} fresh={false} />
        {all.length === 0 ? <span className="bk-vb-empty">The book is still empty.</span> : null}
        <span className="bk-vb-ribbon" aria-hidden="true" />
        {turn ? <span className="bk-vb-leaf" data-turn={turn.way} key={turn.n} aria-hidden="true" /> : null}
      </div>

      <div className="bk-vb-bar">
        <span className="bk-label">
          {caption}
          <span className="bk-vb-count">{all.length}</span>
        </span>
        <span className="bk-sr" aria-live="polite">
          {all.length} {all.length === 1 ? "signature" : "signatures"}
          {spreads > 1 ? ` · ${at + 1} of ${spreads}` : ""}
        </span>
        {spreads > 1 ? (
          <span className="bk-vb-pager">
            <button type="button" onClick={() => go("prev")} disabled={at === 0} aria-label="Newer signatures">
              ←
            </button>
            <span aria-hidden="true">
              {at + 1} / {spreads}
            </span>
            <button type="button" onClick={() => go("next")} disabled={at >= spreads - 1} aria-label="Older signatures">
              →
            </button>
          </span>
        ) : null}
      </div>

      {onSign ? (
        <form className="bk-vb-form" onSubmit={sign}>
          <label>
            <span className="bk-sr">Your name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" maxLength={32} autoComplete="name" required />
          </label>
          <label>
            <span className="bk-sr">A note</span>
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="A note (optional)" maxLength={60} autoComplete="off" />
          </label>
          <button type="submit" className="bk-vb-sign">
            Sign
          </button>
        </form>
      ) : null}
    </div>
  );
}
