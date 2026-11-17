import type { ReactNode } from "react";
import { root, type BaseProps } from "../internal/base";

export interface PlacardProps extends BaseProps {
  /** Catalogue number, shown as "No. 007". */
  number?: string;
  /** The title of the work, set in italic serif. */
  title: ReactNode;
  /** What it is made of: "React, CSS, 2026". */
  medium?: ReactNode;
  /** A short caption. */
  note?: ReactNode;
}

/** The museum label: a mono number, an italic serif title and a small caption. */
export function Placard({ number, title, medium, note, ...base }: PlacardProps) {
  return (
    <div {...root("placard", base)}>
      {number ? <span className="bk-label">No. {number}</span> : null}
      <span className="bk-placard-title">{title}</span>
      {medium ? <span className="bk-placard-medium">{medium}</span> : null}
      {note ? <span className="bk-placard-note">{note}</span> : null}
    </div>
  );
}
