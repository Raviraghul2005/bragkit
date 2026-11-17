import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";

export const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** True when the visitor asked for less motion. Call it in the browser only. */
export function prefersReducedMotion(): boolean {
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * `static`: the finished state. It is what the server renders and what reduced motion keeps.
 * `wait`: mounted, not on screen yet. `run`: on screen, play the entrance.
 */
export type Phase = "static" | "wait" | "run";

/** Plays an entrance once, when the element scrolls into view. */
export function useReveal<T extends Element>(threshold = 0.4): [RefObject<T | null>, Phase] {
  const ref = useRef<T | null>(null);
  const [phase, setPhase] = useState<Phase>("static");

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || typeof IntersectionObserver === "undefined") return;
    setPhase("wait");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPhase("run");
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, phase];
}

/** True after the first client render. Use it for anything the server cannot know. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

interface PointerLike {
  clientX: number;
  clientY: number;
}

/**
 * Tilts an element toward the pointer by writing CSS variables straight to it (no re-render):
 * `--bk-rx` / `--bk-ry` in degrees, `--bk-gx` / `--bk-gy` as the pointer position in percent.
 */
export function tiltToward(el: HTMLElement, e: PointerLike, max = 10): void {
  if (prefersReducedMotion()) return;
  const r = el.getBoundingClientRect();
  if (!r.width || !r.height) return;
  const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
  const y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
  el.style.setProperty("--bk-ry", `${((x - 0.5) * 2 * max).toFixed(2)}deg`);
  el.style.setProperty("--bk-rx", `${((0.5 - y) * 2 * max).toFixed(2)}deg`);
  el.style.setProperty("--bk-gx", `${(x * 100).toFixed(1)}%`);
  el.style.setProperty("--bk-gy", `${(y * 100).toFixed(1)}%`);
}

export function untilt(el: HTMLElement): void {
  for (const name of ["--bk-rx", "--bk-ry", "--bk-gx", "--bk-gy"]) el.style.removeProperty(name);
}
