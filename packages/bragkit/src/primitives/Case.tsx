import type { ReactNode } from "react";
import { root, type BaseProps, type ToneProps } from "../internal/base";

export interface CaseProps extends BaseProps, ToneProps {
  children?: ReactNode;
}

/** The candy gradient card: lighter at the top, richer at the bottom, with a shadow in its own colour. */
export function Case({ tone = "lilac", children, ...base }: CaseProps) {
  return <div {...root("case", { ...base, tone })}>{children}</div>;
}
