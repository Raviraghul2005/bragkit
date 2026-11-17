import type { ReactNode } from "react";
import { clamp, root, type BaseProps, type BragStyle, type ToneProps } from "../../internal/base";

export interface CurrentlyReadingProps extends BaseProps, ToneProps {
  /** The book's title. Default "Untitled". */
  title?: string;
  /** Who wrote it. */
  author?: string;
  /** How far through, 0 to 1. Default 0. The ribbon marks the place. */
  progress?: number;
  /** The colour of the cover, as any CSS colour. Default: from the tone. */
  color?: string;
  /** Makes the book a link, to the book or to your notes on it. */
  href?: string;
  /** Small heading. Default "Currently reading". */
  caption?: string;
}

/**
 * No. 007 · Currently Reading. A book on a shelf, spine out. Hover it and it tilts out to show its cover.
 *
 * ```tsx
 * <CurrentlyReading title="The Soul of a New Machine" author="Tracy Kidder" progress={0.62} />
 * ```
 */
export function CurrentlyReading({
  title = "Untitled",
  author,
  progress = 0,
  color,
  href,
  caption = "Currently reading",
  tone = "cobalt",
  style,
  ...base
}: CurrentlyReadingProps) {
  const pct = Math.round(clamp(progress, 0, 1) * 100);
  const book: ReactNode = (
    <>
      <span className="bk-cr-spine">
        <span className="bk-cr-spine-title">{title}</span>
      </span>
      <span className="bk-cr-cover">
        <span className="bk-cr-cover-title">{title}</span>
        {author ? <span className="bk-cr-cover-author">{author}</span> : null}
        {/* The ribbon hangs down the cover as far as you have read. */}
        <span className="bk-cr-ribbon" style={{ height: `${Math.max(8, pct)}%` }} />
      </span>
    </>
  );

  return (
    <div
      {...root("currently-reading", { ...base, tone })}
      style={(color ? { "--bk-accent": color, ...style } : style) as BragStyle | undefined}
      role="group"
      aria-label={`${caption}: ${title}${author ? ` by ${author}` : ""}, ${pct}% read`}
    >
      <div className="bk-cr-row" aria-hidden={href ? undefined : true}>
        <span className="bk-cr-prop" data-n="1" />
        <span className="bk-cr-prop" data-n="2" />
        {href ? (
          <a className="bk-cr-book" href={href} aria-label={`${title}${author ? ` by ${author}` : ""}`}>
            {book}
          </a>
        ) : (
          <span className="bk-cr-book">{book}</span>
        )}
        <span className="bk-cr-prop" data-n="3" />
        <span className="bk-cr-prop" data-n="4" />
      </div>
      <div className="bk-cr-plank" aria-hidden="true" />
      <div className="bk-cr-meta">
        <span className="bk-label">{caption}</span>
        <span className="bk-title bk-cr-title">{title}</span>
        {author ? <span className="bk-text">{author}</span> : null}
        <div className="bk-cr-progress">
          <div
            className="bk-cr-bar"
            role="progressbar"
            aria-label="Reading progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
          >
            <span style={{ width: `${pct}%` }} />
          </div>
          <span className="bk-cr-pct">{pct}%</span>
        </div>
      </div>
    </div>
  );
}
