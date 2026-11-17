import type { ReactNode } from "react";
import { root, type BaseProps } from "../internal/base";

export interface LiveDotProps extends BaseProps {
  /** The word beside the dot. Default "Live". The dot never appears alone. */
  children?: ReactNode;
}

/** The breathing green dot. Use it only for data that is live right now. */
export function LiveDot({ children = "Live", ...base }: LiveDotProps) {
  return (
    <span {...root("live", base)}>
      <span className="bk-live-dot" aria-hidden="true" />
      {children}
    </span>
  );
}
