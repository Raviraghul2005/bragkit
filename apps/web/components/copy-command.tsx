"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/lib/site";

// Every copy control on the page shows "Copied to clipboard" together for 1.4 s.
let copied = false;
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

function emit(next: boolean) {
  copied = next;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function useCopy() {
  const isCopied = useSyncExternalStore(subscribe, () => copied, () => false);
  const copy = () => {
    try {
      navigator.clipboard?.writeText(site.install).catch(() => {});
    } catch {
      // Clipboard can be blocked; the command stays readable on the plate.
    }
    emit(true);
    clearTimeout(timer);
    timer = setTimeout(() => emit(false), 1400);
  };
  return [isCopied ? "Copied to clipboard" : site.install, copy] as const;
}

/** The engraved brass plate with two screws. */
export function CopyPlate() {
  const [label, copy] = useCopy();
  return (
    <button className="plate" type="button" onClick={copy} aria-label={`Copy install command: ${site.install}`}>
      <span aria-live="polite">{label}</span>
      <span className="shine" aria-hidden="true" />
    </button>
  );
}

/** Lacquer button version, used on the ticket stub. */
export function CopyButton() {
  const [label, copy] = useCopy();
  return (
    <button
      className="btn btn-l btn-mono btn-block"
      type="button"
      onClick={copy}
      aria-label={`Copy install command: ${site.install}`}
    >
      <span aria-live="polite">{label}</span>
    </button>
  );
}
