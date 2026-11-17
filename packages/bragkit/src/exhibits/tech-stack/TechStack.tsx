import { root, type BaseProps } from "../../internal/base";
import { isPale, shortName, withLogos, type TechItem } from "./logic";

export type { TechItem } from "./logic";
export type { Logo } from "./logos";

export interface TechShelfProps extends BaseProps {
  /** What stands on the ledge: `{ name, path, hex }` logos, or items with your own `icon` or `src`. */
  items?: ReadonlyArray<TechItem>;
  /** `brand`: each logo in its own colour. `ink`: every logo in one quiet colour. Default `brand`. */
  color?: "brand" | "ink";
  /** Small label under the ledge. Default "Tech stack". */
  caption?: string;
}

export interface TechStackProps extends Omit<TechShelfProps, "items"> {
  /** The tools, as names ("TypeScript", "React") or items. Names bragkit knows get their real logo. */
  items?: ReadonlyArray<string | TechItem>;
}

const DEFAULT_ITEMS = ["TypeScript", "React", "Next.js", "Postgres", "Tailwind CSS"];

/**
 * The ledge without the built-in logos, for the smallest bundle. Bring your own, or import
 * single logos from `bragkit/logos`.
 *
 * ```tsx
 * import { react, typescript } from "bragkit/logos";
 * <TechShelf items={[typescript, react, { name: "Mine", icon: <MyLogo /> }]} />
 * ```
 */
export function TechShelf({ items = [], color = "brand", caption = "Tech stack", ...base }: TechShelfProps) {
  return (
    <div {...root("tech-stack", base)} data-color={color} role="group" aria-label={caption}>
      <ul className="bk-ts-row">
        {items.map((item, i) => {
          const dark = color === "brand" && item.hex !== undefined && isPale(item.hex);
          const art = item.icon ? (
            <span className="bk-ts-logo">{item.icon}</span>
          ) : item.src ? (
            <img className="bk-ts-logo" src={item.src} alt="" loading="lazy" decoding="async" />
          ) : item.path ? (
            <svg
              className="bk-ts-logo"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={color === "brand" && item.hex ? { color: `#${item.hex}` } : undefined}
            >
              <path d={item.path} />
            </svg>
          ) : (
            <span className="bk-ts-letters">{item.short ?? shortName(item.name)}</span>
          );
          const inside = (
            <>
              <span className="bk-ts-mat" aria-hidden="true">
                {art}
              </span>
              <span className="bk-sr">{item.name}</span>
              <span className="bk-tip" aria-hidden="true">
                {item.name}
              </span>
            </>
          );
          const props = { className: "bk-ts-frame bk-has-tip", "data-dark": dark ? "" : undefined };
          return (
            <li key={`${item.name}-${i}`}>
              {item.href ? (
                <a {...props} href={item.href}>
                  {inside}
                </a>
              ) : (
                <span {...props}>{inside}</span>
              )}
            </li>
          );
        })}
      </ul>
      <div className="bk-ts-ledge" aria-hidden="true" />
      <span className="bk-label bk-ts-label">{caption}</span>
    </div>
  );
}

/**
 * No. 005 · Tech Stack Shelf. The tools you use, as small framed logos on a picture ledge.
 *
 * ```tsx
 * <TechStack items={["TypeScript", "React", { name: "Postgres", href: "https://postgresql.org" }]} />
 * ```
 */
export function TechStack({ items = DEFAULT_ITEMS, ...rest }: TechStackProps) {
  return <TechShelf {...rest} items={withLogos(items)} />;
}
