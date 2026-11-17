"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { root, type BaseProps } from "../internal/base";

export interface BrassPlateProps extends BaseProps {
  /** Text put on the clipboard when the plate is pressed. Without it the plate is not a button. */
  copy?: string;
  /** What is engraved on the plate. Default: the `copy` text. */
  children?: ReactNode;
  /** Shown for a moment after copying. Default "Copied". */
  copiedLabel?: string;
}

/** The engraved brass plate with two screws and one shine sweep. Press it to copy. */
export function BrassPlate({ copy, children, copiedLabel = "Copied", ...base }: BrassPlateProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const label = children ?? copy;
  if (copy === undefined) {
    return (
      <span {...root("plate", base)}>
        <span className="bk-plate-text">{label}</span>
      </span>
    );
  }

  const press = () => {
    try {
      navigator.clipboard?.writeText(copy).catch(() => {});
    } catch {
      // The clipboard can be blocked; the text stays readable on the plate.
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1400);
  };

  return (
    <button {...root("plate", base)} type="button" onClick={press} aria-label={`Copy: ${copy}`}>
      <span className="bk-plate-text" aria-live="polite">
        {copied ? copiedLabel : label}
      </span>
      <span className="bk-shine" aria-hidden="true" />
    </button>
  );
}
