import { root, type BaseProps, type BragStyle } from "../../internal/base";
import { languageColor } from "../../internal/languages";

export interface CodingLanguage {
  /** The language: "TypeScript". */
  name: string;
  /** Minutes spent in it today. */
  minutes: number;
  /** The chip's colour. Default: the language's usual colour. */
  color?: string;
}

export interface CodingTodayProps extends BaseProps {
  /** One paint chip per language. Three to six fan best. */
  languages?: readonly CodingLanguage[];
  /** Small heading. Default "Coding today". */
  caption?: string;
}

const FALLBACK = ["#2742d4", "#138a63", "#e2702a", "#d63a78", "#6f4fe0", "#52525b"];
const DEFAULT_LANGUAGES: CodingLanguage[] = [
  { name: "TypeScript", minutes: 95 },
  { name: "CSS", minutes: 40 },
];

/** 134 → "2h 14m", 45 → "45m", 120 → "2h". */
export function formatMinutes(minutes: number): string {
  const total = Math.max(0, Math.round(Number.isFinite(minutes) ? minutes : 0));
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/**
 * No. 008 · Coding Today. A fan deck of paint chips, one per language.
 *
 * ```tsx
 * <CodingToday languages={[{ name: "TypeScript", minutes: 134 }, { name: "CSS", minutes: 52 }]} />
 * ```
 */
export function CodingToday({ languages = DEFAULT_LANGUAGES, caption = "Coding today", style, ...base }: CodingTodayProps) {
  const total = languages.reduce((sum, l) => sum + (Number.isFinite(l.minutes) ? Math.max(0, l.minutes) : 0), 0);

  return (
    <div
      {...root("coding-today", base)}
      style={{ "--bk-n": languages.length, ...style } as BragStyle}
      role="group"
      aria-label={caption}
    >
      <ul className="bk-cd-fan">
        {languages.map((language, i) => (
          <li
            key={`${language.name}-${i}`}
            style={{ "--bk-i": i, "--bk-c": language.color ?? languageColor(language.name) ?? FALLBACK[i % FALLBACK.length] } as BragStyle}
          >
            <span className="bk-cd-chip">
              <span className="bk-cd-name">{language.name}</span>
              <span className="bk-cd-time">{formatMinutes(language.minutes)}</span>
              <span className="bk-cd-swatch" aria-hidden="true" />
            </span>
          </li>
        ))}
        <li className="bk-cd-rivet" aria-hidden="true" />
      </ul>
      <div className="bk-cd-meta">
        <span className="bk-label">{caption}</span>
        <span className="bk-text">{formatMinutes(total)}</span>
      </div>
    </div>
  );
}
