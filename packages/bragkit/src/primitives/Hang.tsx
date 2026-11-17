import type { ReactNode } from "react";
import { root, type BaseProps, type BragStyle } from "../internal/base";

export interface HangProps extends BaseProps {
  /** Length of the wire in pixels. Default 96. */
  drop?: number;
  /** How far it swings each way, in degrees. Default 1.5. `0` hangs still. */
  sway?: number;
  /** Seconds for one swing. Default 7. */
  duration?: number;
  children?: ReactNode;
}

/** Hangs any child from a brass nail on a wire, swaying gently. */
export function Hang({ drop = 96, sway = 1.5, duration = 7, children, style, ...base }: HangProps) {
  return (
    <div
      {...root("hang", base)}
      style={{ "--bk-drop": `${drop}px`, "--bk-sway": `${sway}deg`, "--bk-sway-dur": `${duration}s`, ...style } as BragStyle}
    >
      <span className="bk-hang-nail" aria-hidden="true" />
      <span className="bk-hang-wire" aria-hidden="true" />
      <div className="bk-hang-obj">{children}</div>
    </div>
  );
}
