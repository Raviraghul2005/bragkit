import { root, type BaseProps, type ToneProps } from "../../internal/base";
import type { DayInput } from "../../internal/days";
import { weave, type Contribution } from "./weave";

export type { Contribution } from "./weave";

export interface ContributionTapestryProps extends BaseProps, ToneProps {
  /** Your activity: one `{ date, count }` per day that had any. */
  data?: readonly Contribution[];
  /** How many weeks of cloth. Default 26. */
  weeks?: number;
  /** The last day on the cloth. Default: the latest day in `data`. */
  end?: DayInput;
  /** What is being counted, for the caption and the tooltips. Default "contributions". */
  unit?: string;
  /** Small heading. Default "Contributions". */
  caption?: string;
}

const dayName = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });

/**
 * No. 009 · Contribution Tapestry. A year of activity, woven.
 *
 * ```tsx
 * <ContributionTapestry data={[{ date: "2026-11-12", count: 4 }, { date: "2026-11-13", count: 9 }]} />
 * ```
 */
export function ContributionTapestry({
  data = [],
  weeks = 26,
  end,
  unit = "contributions",
  caption = "Contributions",
  tone = "lilac",
  ...base
}: ContributionTapestryProps) {
  const { rows, total } = weave(data, weeks, end);
  const columns = rows[0].length;
  const summary = total > 0 ? `${total.toLocaleString("en-US")} ${unit} in ${columns} weeks` : `No ${unit} yet`;

  return (
    <div {...root("contribution-tapestry", { ...base, tone })} role="group" aria-label={caption}>
      <div className="bk-ct-hang">
        <div className="bk-ct-rod" aria-hidden="true" />
        <div className="bk-ct-cloth" role="img" aria-label={summary}>
        {rows.map((row, r) => (
          <div className="bk-ct-row" key={r}>
            {row.map((stitch, c) => (
              <span
                key={c}
                className="bk-ct-st"
                data-l={stitch.day ? stitch.level : undefined}
                data-tip={
                  stitch.day
                    ? `${stitch.count || "No"} ${stitch.count === 1 ? unit.replace(/s$/, "") : unit} · ${dayName.format(new Date(`${stitch.day}T00:00:00Z`))}`
                    : undefined
                }
                data-edge={c < 5 ? "start" : c > columns - 6 ? "end" : undefined}
              />
            ))}
          </div>
        ))}
        </div>
        <div className="bk-ct-fringe" aria-hidden="true" />
      </div>
      <div className="bk-ct-meta">
        <span className="bk-label">{caption}</span>
        <span className="bk-text">{summary}</span>
      </div>
    </div>
  );
}
