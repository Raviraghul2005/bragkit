"use client";

import { useEffect, useState } from "react";
import { root, type BaseProps, type ToneProps } from "../../internal/base";

export interface OpenForWorkProps extends BaseProps, ToneProps {
  /** Which side faces out: `true` shows OPEN, `false` shows CLOSED. Default `true`. */
  open?: boolean;
  /** A short line on the open side: "Freelance, from January". */
  note?: string;
  /** Where "Say hello" goes: a mailto: link, a contact page. Shown under the sign while it says open. */
  href?: string;
  /** Text of that link. Default "Say hello". */
  linkLabel?: string;
  /** Called when a visitor turns the sign over, with the side now showing. */
  onFlip?: (open: boolean) => void;
}

/**
 * No. 006 · Open For Work. A door sign on a string. Click it and it turns over.
 *
 * ```tsx
 * <OpenForWork open note="Freelance, from January" href="mailto:you@example.com" />
 * ```
 */
export function OpenForWork({
  open = true,
  note,
  href,
  linkLabel = "Say hello",
  onFlip,
  tone = "mint",
  ...base
}: OpenForWorkProps) {
  const [showing, setShowing] = useState(open);
  // Counts the turns. Each one restarts the swing.
  const [turns, setTurns] = useState(0);
  useEffect(() => setShowing(open), [open]);

  const flip = () => {
    const next = !showing;
    setShowing(next);
    setTurns((n) => n + 1);
    onFlip?.(next);
  };

  const says = showing ? "Open for work" : "Closed for now";

  return (
    <div {...root("open-for-work", { ...base, tone })} data-side={showing ? "open" : "closed"}>
      <span className="bk-ofw-nail" aria-hidden="true" />
      <div className="bk-ofw-swing" data-swing={turns === 0 ? undefined : turns % 2 ? "a" : "b"}>
        <svg className="bk-ofw-string" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
          <path d="M50 1 L14 30 M50 1 L86 30" />
        </svg>
        <button
          type="button"
          className="bk-ofw-sign"
          onClick={flip}
          aria-label={`${says}${showing && note ? `. ${note}` : ""}. Turn the sign over.`}
        >
          <span className="bk-ofw-face bk-ofw-open" aria-hidden="true">
            <span className="bk-ofw-small">Come in</span>
            <span className="bk-ofw-word">Open</span>
            <span className="bk-ofw-sub">for work</span>
            {note ? <span className="bk-ofw-note">{note}</span> : null}
          </span>
          <span className="bk-ofw-face bk-ofw-closed" aria-hidden="true">
            <span className="bk-ofw-small">Sorry</span>
            <span className="bk-ofw-word">Closed</span>
            <span className="bk-ofw-sub">for now</span>
          </span>
        </button>
      </div>
      <div className="bk-ofw-foot">
        {href && showing ? (
          <a className="bk-ofw-link" href={href}>
            {linkLabel}
            <span aria-hidden="true"> →</span>
          </a>
        ) : null}
      </div>
    </div>
  );
}
