import { clamp, root, type BaseProps, type ToneProps } from "../../internal/base";

export interface NowPlayingProps extends BaseProps, ToneProps {
  /** The song title. Default "Untitled". */
  track?: string;
  /** Who it is by. Default "Unknown artist". */
  artist?: string;
  /** How far through the track, 0 to 1. Default 0.4. */
  progress?: number;
  /** Stops the record and the equaliser. Default `false`. */
  paused?: boolean;
  /** Makes the title a link, to the track or the album. */
  href?: string;
  /** Small heading above the title. Default "Now playing", or "Paused". */
  caption?: string;
}

/**
 * No. 001 · Now Playing. A record sleeve with the vinyl sliding out. Static: you pass the song.
 *
 * ```tsx
 * <NowPlaying track="Baby" artist="Justin Bieber" progress={0.62} />
 * ```
 */
export function NowPlaying({
  track = "Untitled",
  artist = "Unknown artist",
  progress = 0.4,
  paused = false,
  href,
  caption,
  tone = "lilac",
  ...base
}: NowPlayingProps) {
  const pct = Math.round(clamp(progress, 0, 1) * 100);
  const heading = caption || (paused ? "Paused" : "Now playing");

  return (
    <div
      {...root("now-playing", { ...base, tone })}
      data-paused={paused ? "" : undefined}
      role="group"
      aria-label={`${heading}: ${track} by ${artist}`}
    >
      <div className="bk-np-stage" aria-hidden="true">
        <div className="bk-np-slide">
          <div className="bk-np-boost">
            <div className="bk-np-disc" />
          </div>
        </div>
        <div className="bk-np-sleeve">
          <span className="bk-np-print">Side A</span>
          <span className="bk-np-print">33 RPM</span>
        </div>
      </div>
      <div className="bk-np-meta">
        <span className="bk-label">
          <span className="bk-np-eq" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
          {heading}
        </span>
        {href ? (
          <a className="bk-title bk-np-track" href={href}>
            {track}
          </a>
        ) : (
          <span className="bk-title bk-np-track">{track}</span>
        )}
        <span className="bk-text bk-np-artist">{artist}</span>
        <div
          className="bk-np-bar"
          role="progressbar"
          aria-label="Track progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
        >
          <span style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
