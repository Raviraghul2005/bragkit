import { root, type BaseProps, type ToneProps } from "../../internal/base";
import { BOX, DRAWINGS, type DeskKind } from "./drawings";

export type { DeskKind } from "./drawings";

export interface DeskItem {
  /** Which object to draw: monitor, laptop, keyboard, mouse, mug, plant, lamp, headphones, notebook or speaker. */
  kind: DeskKind | (string & {});
  /** What it is: "Keychron K2, brown switches". Shown on hover. */
  label: string;
  /** Makes the object a link. */
  href?: string;
}

export interface DeskSetupProps extends BaseProps, ToneProps {
  /** What is on your desk, left to right. Four to six fit best. */
  items?: readonly DeskItem[];
  /** Small label under the desk. Default "Desk setup". */
  caption?: string;
}

const DEFAULT_ITEMS: DeskItem[] = [
  { kind: "laptop", label: "A laptop" },
  { kind: "mug", label: "Coffee" },
  { kind: "plant", label: "A plant, still alive" },
];

/**
 * No. 018 · Desk Setup. Your desk, drawn simply. Hover an object and it lights up and says what it is.
 *
 * ```tsx
 * <DeskSetup items={[{ kind: "keyboard", label: "Keychron K2" }, { kind: "mug", label: "Flat white" }]} />
 * ```
 */
export function DeskSetup({ items = DEFAULT_ITEMS, caption = "Desk setup", tone = "apricot", ...base }: DeskSetupProps) {
  return (
    <div {...root("desk-setup", { ...base, tone })} role="group" aria-label={caption}>
      <ul className="bk-dk-row">
        {items.map((item, i) => {
          const drawing = DRAWINGS[item.kind as DeskKind] ?? BOX;
          const art = (
            <>
              <svg viewBox="0 0 48 48" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {drawing.light ? <path className="bk-dk-light" data-light={drawing.lightKind} d={drawing.light} /> : null}
                <path className="bk-dk-body" d={drawing.body} />
                {drawing.lines ? <path className="bk-dk-lines" d={drawing.lines} /> : null}
              </svg>
              <span className="bk-sr">{item.label}</span>
            </>
          );
          return (
            <li key={`${item.kind}-${i}`} className="bk-has-tip">
              {item.href ? (
                <a className="bk-dk-item" href={item.href}>
                  {art}
                </a>
              ) : (
                <span className="bk-dk-item">{art}</span>
              )}
              <span className="bk-tip" aria-hidden="true">
                {item.label}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="bk-dk-top" aria-hidden="true" />
      <span className="bk-label bk-dk-label">{caption}</span>
    </div>
  );
}
