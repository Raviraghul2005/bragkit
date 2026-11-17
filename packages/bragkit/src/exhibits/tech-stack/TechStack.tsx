import { root, type BaseProps, type BragStyle, type ToneProps } from "../../internal/base";
import { isPale, shortName, toGroups, withLogo, type TechItem } from "./logic";

export type { TechItem } from "./logic";
export type { Logo } from "./logos";

export interface TechKeyboardProps extends BaseProps, ToneProps {
  /** The keys, as items with their logo (`{ name, path, hex }`) or your own `icon` or `src`. */
  items?: readonly TechItem[];
  /** Or rows of keys by name: `{ Languages: [...], Tools: [...] }`. Each row gets a small label. */
  groups?: Readonly<Record<string, readonly TechItem[]>>;
  /** How many keys fit across, at most. Fewer fit on a narrow screen. Default 10. */
  columns?: number;
  /** `brand`: each logo in its own colour. `ink`: every logo in one quiet colour. Default `brand`. */
  color?: "brand" | "ink";
  /** Engraved on the case, and shown on the screen until a key is pressed. Default "Tech stack". */
  caption?: string;
}

export interface TechStackProps extends Omit<TechKeyboardProps, "items" | "groups"> {
  /** The tools, as names ("TypeScript", "React") or items. Names bragkit knows get their real logo. */
  items?: ReadonlyArray<string | TechItem>;
  /** Or rows of tools by name: `{ Languages: ["TypeScript", "Rust"], Tools: ["Git", "Docker"] }`. */
  groups?: Readonly<Record<string, ReadonlyArray<string | TechItem>>>;
}

const DEFAULT_ITEMS: TechItem[] = [
  { name: "TypeScript", wide: true },
  { name: "React" },
  { name: "Next.js" },
  { name: "Postgres" },
  { name: "Tailwind CSS" },
  { name: "Git" },
];

function Key({ item, color }: { item: TechItem; color: "brand" | "ink" }) {
  const dark = color === "brand" && item.hex !== undefined && isPale(item.hex);
  const legend = item.icon ? (
    <span className="bk-kb-logo">{item.icon}</span>
  ) : item.src ? (
    <img className="bk-kb-logo" src={item.src} alt="" loading="lazy" decoding="async" />
  ) : item.path ? (
    <svg
      className="bk-kb-logo"
      viewBox="0 0 24 24"
      fill="currentColor"
      style={color === "brand" && item.hex ? { color: `#${item.hex}` } : undefined}
    >
      <path d={item.path} />
    </svg>
  ) : (
    <span className="bk-kb-letters">{item.short ?? shortName(item.name)}</span>
  );

  const face = (
    <>
      <span className="bk-kb-face" aria-hidden="true">
        {legend}
        {item.wide ? <span className="bk-kb-name">{item.name}</span> : null}
      </span>
      <span className="bk-sr">
        {item.name}
        {item.note ? `, ${item.note}` : ""}
      </span>
    </>
  );
  const props = {
    className: "bk-kb-key",
    "data-cap": dark ? "dark" : item.wide ? "mod" : undefined,
  };

  return (
    <li data-w={item.wide ? "2" : undefined}>
      {item.href ? (
        <a {...props} href={item.href}>
          {face}
        </a>
      ) : (
        <span {...props}>{face}</span>
      )}
      {/* Shown on the keyboard's screen while this key is pressed. */}
      <span className="bk-kb-say" aria-hidden="true">
        <span className="bk-kb-type">
          {item.name}
          {item.note ? <span className="bk-kb-note"> · {item.note}</span> : null}
        </span>
      </span>
    </li>
  );
}

/**
 * The keyboard without the built-in logos, for the smallest bundle. Bring your own, or import
 * single logos from `bragkit/logos`.
 *
 * ```tsx
 * import { react, typescript } from "bragkit/logos";
 * <TechKeyboard items={[{ ...typescript, wide: true }, react, { name: "Mine", icon: <MyLogo /> }]} />
 * ```
 */
export function TechKeyboard({
  items,
  groups,
  columns = 10,
  color = "brand",
  caption = "Tech stack",
  tone = "plain",
  style,
  ...base
}: TechKeyboardProps) {
  const rows = toGroups(items, groups);
  const keys = rows.reduce((n, row) => n + row.items.length, 0);
  const cols = Math.max(4, Math.min(24, Math.round(columns)));

  return (
    <div
      {...root("tech-stack", { ...base, tone })}
      style={{ "--bk-kb-cols": cols, ...style } as BragStyle}
      data-color={color}
      role="group"
      aria-label={caption}
    >
      <div className="bk-kb-case">
        <div className="bk-kb-top">
          <span className="bk-kb-badge">{caption}</span>
          <span className="bk-kb-screen" aria-hidden="true">
            <span className="bk-kb-idle">
              {keys} {keys === 1 ? "key" : "keys"}
            </span>
          </span>
        </div>
        <div className="bk-kb-well">
          {rows.map((row, r) => (
            <div className="bk-kb-row" key={`${row.label ?? ""}-${r}`}>
              {row.label ? <span className="bk-kb-legend">{row.label}</span> : null}
              <ul className="bk-kb-keys" aria-label={row.label}>
                {row.items.map((item, i) => (
                  <Key key={`${item.name}-${i}`} item={item} color={color} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * No. 005 · Tech Stack Keyboard. Every tool you use is a key, with its real logo printed on it.
 * Press a key and its name comes up on the keyboard's little screen.
 *
 * ```tsx
 * <TechStack groups={{ Languages: [{ name: "TypeScript", wide: true }, "Rust"], Tools: ["Git", "Docker"] }} />
 * ```
 */
export function TechStack({ items, groups, ...rest }: TechStackProps) {
  if (groups) {
    const withLogos = Object.fromEntries(Object.entries(groups).map(([label, list]) => [label, list.map(withLogo)]));
    return <TechKeyboard {...rest} groups={withLogos} />;
  }
  return <TechKeyboard {...rest} items={(items ?? DEFAULT_ITEMS).map(withLogo)} />;
}
