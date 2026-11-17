import type { ReactNode } from "react";
import { root, type BaseProps } from "../internal/base";

export interface MedalProps extends BaseProps {
  children?: ReactNode;
}

/** The small brass chip for a count: stars, visitors, anything worth a medal. */
export function Medal({ children, ...base }: MedalProps) {
  return <span {...root("medal", base)}>{children}</span>;
}
