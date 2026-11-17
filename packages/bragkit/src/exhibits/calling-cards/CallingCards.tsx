import { root, type BaseProps, type BragStyle, type ToneProps } from "../../internal/base";

export interface CallingCard {
  /** Where it leads: "GitHub", "Email". */
  label: string;
  /** Your name there: "@ada", "ada@example.com". */
  handle: string;
  href: string;
}

export interface CallingCardsProps extends BaseProps, ToneProps {
  /** One card per link. Three to five fan best. */
  links?: readonly CallingCard[];
  /** Small label under the cards. Default "Calling cards". */
  caption?: string;
}

const DEFAULT_LINKS: CallingCard[] = [
  { label: "GitHub", handle: "@you", href: "https://github.com" },
  { label: "Email", handle: "you@example.com", href: "mailto:you@example.com" },
];

/**
 * No. 015 · Calling Cards. A fan of cards, one per link. Letters only, no logos.
 *
 * ```tsx
 * <CallingCards links={[{ label: "GitHub", handle: "@ada", href: "https://github.com/ada" }]} />
 * ```
 */
export function CallingCards({ links = DEFAULT_LINKS, caption = "Calling cards", tone = "plain", style, ...base }: CallingCardsProps) {
  return (
    <div
      {...root("calling-cards", { ...base, tone })}
      style={{ "--bk-n": links.length, ...style } as BragStyle}
      role="group"
      aria-label={caption}
    >
      <ul className="bk-cc-fan">
        {links.map((link, i) => (
          <li key={`${link.label}-${i}`} style={{ "--bk-i": i } as BragStyle}>
            <a className="bk-cc-card" href={link.href}>
              <span className="bk-cc-label">{link.label}</span>
              <span className="bk-cc-handle">{link.handle}</span>
              <span className="bk-cc-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
      <span className="bk-label bk-cc-caption">{caption}</span>
    </div>
  );
}
