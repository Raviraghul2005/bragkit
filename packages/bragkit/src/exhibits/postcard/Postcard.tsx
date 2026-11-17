"use client";

import { useState } from "react";
import { root, type BaseProps, type ToneProps } from "../../internal/base";

export interface PostcardProps extends BaseProps, ToneProps {
  /** Where you are, printed on the front. Default "Somewhere nice". */
  place?: string;
  /** What you wrote on the back. */
  message?: string;
  /** Your email. The "write to me" line on the back links to it. */
  email?: string;
  /** How the message is signed. */
  from?: string;
  /** Start with the back showing. Default `false`. */
  flipped?: boolean;
}

/**
 * No. 017 · Postcard. Click it and it turns over. The back has your message, a stamp and a line to write to you.
 *
 * ```tsx
 * <Postcard place="Lisbon" message="Wish you were here. The wifi is fine." email="you@example.com" />
 * ```
 */
export function Postcard({
  place = "Somewhere nice",
  message = "Wish you were here.",
  email,
  from,
  flipped = false,
  tone = "apricot",
  ...base
}: PostcardProps) {
  const [back, setBack] = useState(flipped);
  const flip = () => setBack((b) => !b);

  return (
    <div {...root("postcard", { ...base, tone })} data-side={back ? "back" : "front"}>
      <div className="bk-pc-card">
        <button
          type="button"
          className="bk-pc-face bk-pc-front"
          onClick={flip}
          tabIndex={back ? -1 : 0}
          aria-hidden={back}
          aria-label={`Postcard from ${place}. Turn it over.`}
        >
          <span className="bk-pc-art" aria-hidden="true">
            <span className="bk-pc-sun" />
          </span>
          <span className="bk-pc-words" aria-hidden="true">
            <span className="bk-pc-greet">Greetings from</span>
            <span className="bk-pc-place">{place}</span>
          </span>
        </button>

        <div className="bk-pc-face bk-pc-back" aria-hidden={!back}>
          <div className="bk-pc-msg">
            <span>{message}</span>
            {from ? <span className="bk-pc-from">{from}</span> : null}
          </div>
          <div className="bk-pc-side">
            <span className="bk-pc-stamp" aria-hidden="true">
              <span className="bk-pc-sun" />
            </span>
            <span className="bk-pc-mark" aria-hidden="true" />
            <span className="bk-pc-to">Write to me</span>
            {email ? (
              <a className="bk-pc-line" href={`mailto:${email}`} tabIndex={back ? 0 : -1}>
                {email}
              </a>
            ) : (
              <span className="bk-pc-line" />
            )}
            <span className="bk-pc-line" />
            <span className="bk-pc-line" />
          </div>
          <button type="button" className="bk-pc-turn" onClick={flip} tabIndex={back ? 0 : -1} aria-label="Turn the postcard over">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 12a8 8 0 0113.7-5.6L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 01-13.7 5.6L4 15.5M4 20v-4.5h4.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
