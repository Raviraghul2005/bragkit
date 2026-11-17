import type { ReactNode } from "react";
import { root, type BaseProps } from "../internal/base";

export interface PlinthProps extends BaseProps {
  children?: ReactNode;
}

/** Stands any child on a soft contact shadow. The child lifts when hovered or focused. */
export function Plinth({ children, ...base }: PlinthProps) {
  return (
    <div {...root("plinth", base)}>
      <div className="bk-plinth-obj">{children}</div>
    </div>
  );
}
