import type { CSSProperties } from "react";

/** Colour of an exhibit. Tones keep their colours in the dark theme; `plain` follows it. */
export type Tone = "apricot" | "lilac" | "mint" | "rose" | "cobalt" | "plain";
export type Size = "sm" | "md" | "lg";
export type Theme = "light" | "dark" | "auto";

/** Inline styles, plus any CSS variable such as `--bk-accent`. */
export type BragStyle = CSSProperties & { [variable: `--${string}`]: string | number | undefined };

/** Props every exhibit and primitive takes. */
export interface BaseProps {
  /** `sm`, `md` or `lg`. Default `md`. Set `--bk-scale` for anything in between. */
  size?: Size;
  /** `light`, `dark` or `auto` (follows the system). Default: follows the page, which is dark under `[data-theme="dark"]`. */
  theme?: Theme;
  className?: string;
  style?: BragStyle;
  id?: string;
}

export interface ToneProps {
  /** `apricot`, `lilac`, `mint`, `rose`, `cobalt` or `plain`. */
  tone?: Tone;
}

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** The attributes of an exhibit's root element. */
export function root(name: string, props: BaseProps & ToneProps, extra?: string) {
  return {
    id: props.id,
    className: cx("bk", `bk-${name}`, extra, props.className),
    style: props.style,
    "data-size": props.size ?? "md",
    "data-tone": props.tone,
    "data-bk-theme": props.theme,
  };
}

export function clamp(value: number, min: number, max: number): number {
  return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : min;
}
