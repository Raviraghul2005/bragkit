"use client";

import { useState } from "react";
import { root, type BaseProps, type BragStyle, type ToneProps } from "../../internal/base";

export interface Polaroid {
  /** Written under the picture. */
  caption: string;
  /** The picture. Without it the polaroid shows a small abstract print in the tone. */
  src?: string;
  /** Describes the picture for people who cannot see it. Default: the caption. */
  alt?: string;
  /** Where "Open" under the stack goes while this photo is on top. */
  href?: string;
}

export interface PolaroidStackProps extends BaseProps, ToneProps {
  /** The photos, top one first. Three to six stack best. */
  photos?: readonly Polaroid[];
  /** Small heading. Default "Polaroids". */
  caption?: string;
}

const DEFAULT_PHOTOS: Polaroid[] = [{ caption: "First project" }, { caption: "Second project" }, { caption: "Third project" }];
// How each print sits in the pile, so the stack looks dropped, not arranged.
const TILTS = [-3, 4, -6, 2, 6, -2];

/**
 * No. 014 · Polaroid Stack. A pile of polaroids. Click to deal the top one to the back.
 *
 * ```tsx
 * <PolaroidStack photos={[{ src: "/shots/app.png", caption: "The app", href: "/projects/app" }]} />
 * ```
 */
export function PolaroidStack({ photos = DEFAULT_PHOTOS, caption = "Polaroids", tone = "apricot", style, ...base }: PolaroidStackProps) {
  // Which photo is on top, and which one was just dealt (so it can travel round to the back).
  const [top, setTop] = useState(0);
  const [dealt, setDealt] = useState<{ index: number; n: number } | null>(null);
  const count = photos.length;
  const current = count ? photos[top % count] : undefined;

  const deal = () => {
    if (count < 2) return;
    setDealt((d) => ({ index: top % count, n: (d?.n ?? 0) + 1 }));
    setTop((t) => (t + 1) % count);
  };

  return (
    <div
      {...root("polaroid-stack", { ...base, tone })}
      style={{ "--bk-n": count, ...style } as BragStyle}
      role="group"
      aria-label={caption}
    >
      <div className="bk-ps-pile">
        {photos.map((photo, i) => {
          const place = (i - (top % count) + count) % count;
          const wasDealt = dealt?.index === i;
          return (
            <div
              className="bk-ps-photo"
              key={wasDealt ? `${i}-${dealt?.n}` : i}
              data-dealt={wasDealt ? "" : undefined}
              style={{ "--bk-p": place, "--bk-r": `${TILTS[i % TILTS.length]}deg` } as BragStyle}
              aria-hidden={place !== 0}
            >
              <span className="bk-ps-print">
                {photo.src ? (
                  <img src={photo.src} alt={place === 0 ? (photo.alt ?? photo.caption) : ""} loading="lazy" decoding="async" />
                ) : (
                  <span className="bk-ps-art" data-art={i % 4} aria-hidden="true" />
                )}
              </span>
              <span className="bk-ps-caption">{photo.caption}</span>
            </div>
          );
        })}
        {count > 1 ? (
          <button type="button" className="bk-ps-deal" onClick={deal} aria-label="Next photo: put the top one at the back" />
        ) : null}
      </div>
      <div className="bk-ps-meta">
        <span className="bk-label">{caption}</span>
        {count ? (
          <span className="bk-ps-count" aria-live="polite">
            <span className="bk-sr">{current?.caption}, </span>
            {(top % count) + 1} / {count}
          </span>
        ) : (
          <span className="bk-text">No photos yet.</span>
        )}
        {current?.href ? (
          <a className="bk-ps-open" href={current.href}>
            Open<span className="bk-sr"> {current.caption}</span>
            <span aria-hidden="true"> →</span>
          </a>
        ) : null}
      </div>
    </div>
  );
}
