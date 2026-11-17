"use client";

import type { PointerEvent, ReactNode } from "react";
import { root, type BaseProps, type ToneProps } from "../../internal/base";
import { tiltToward, untilt } from "../../internal/hooks";
import { languageColor } from "../../internal/languages";

export interface PinnedRepoProps extends BaseProps, ToneProps {
  /** The project's name. Default "your-project". */
  name?: string;
  /** One or two lines about it. */
  description?: string;
  /** Star count. Numbers are shortened: 1234 becomes 1.2k. */
  stars?: number | string;
  /** Main language, shown with its usual colour dot. */
  language?: string;
  /** Makes the whole frame a link to the project. */
  href?: string;
  /** Small label above the name. Default "Repository". */
  caption?: string;
}

/** 1234 → "1.2k", 15300 → "15k", 980 → "980". Text is shown as it is. */
export function formatStars(stars: number | string): string {
  if (typeof stars === "string") return stars;
  if (!Number.isFinite(stars) || stars < 0) return "0";
  if (stars < 1000) return String(Math.round(stars));
  const k = stars / 1000;
  return `${k < 10 ? k.toFixed(1).replace(/\.0$/, "") : Math.round(k)}k`;
}

/**
 * No. 013 · Pinned Repo. A project in a small frame. The frame tilts with the pointer.
 *
 * ```tsx
 * <PinnedRepo name="bragkit" description="Live exhibits for your portfolio." stars={1284} language="TypeScript" href="https://github.com/you/bragkit" />
 * ```
 */
export function PinnedRepo({
  name = "your-project",
  description,
  stars,
  language,
  href,
  caption = "Repository",
  tone = "plain",
  ...base
}: PinnedRepoProps) {
  const move = (e: PointerEvent<HTMLElement>) => tiltToward(e.currentTarget, e, 7);
  const leave = (e: PointerEvent<HTMLElement>) => untilt(e.currentTarget);

  const inside: ReactNode = (
    <span className="bk-pr-frame">
      <span className="bk-pr-mat">
        <span className="bk-label">{caption}</span>
        <span className="bk-pr-name">{name}</span>
        {description ? <span className="bk-text bk-pr-about">{description}</span> : null}
        {language || stars !== undefined ? (
          <span className="bk-pr-foot">
            {language ? (
              <span className="bk-pr-lang">
                <span
                  className="bk-pr-dot"
                  style={{ background: languageColor(language) }}
                  aria-hidden="true"
                />
                {language}
              </span>
            ) : (
              <span />
            )}
            {stars !== undefined ? (
              <span className="bk-medal bk-pr-stars">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-3-5.4 3 1.1-6-4.5-4.2 6.1-.8z" />
                </svg>
                {formatStars(stars)}
                <span className="bk-sr"> stars</span>
                <span className="bk-shine" aria-hidden="true" />
              </span>
            ) : null}
          </span>
        ) : null}
      </span>
      <span className="bk-pr-glare" aria-hidden="true" />
    </span>
  );

  const props = { ...root("pinned-repo", { ...base, tone }), onPointerMove: move, onPointerLeave: leave };
  return href ? (
    <a {...props} href={href}>
      {inside}
    </a>
  ) : (
    <div {...props}>{inside}</div>
  );
}
