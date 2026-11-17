import { Glint, Wordmark } from "../glint";
import { site } from "@/lib/site";

const columns: { title: string; links: [string, string][] }[] = [
  {
    title: "Collection",
    links: [
      ["Now Playing", "/exhibits#now-playing"],
      ["Shipping Streak", "/exhibits#streak"],
      ["Local Time", "/exhibits#local-time"],
      ["Status Card", "/exhibits#status-card"],
      ["Tech Stack Keyboard", "/exhibits/tech-stack"],
    ],
  },
  {
    title: "Developers",
    links: [
      ["Docs", "/docs"],
      ["GitHub", site.repo],
      ["Issues", site.issues],
    ],
  },
  {
    title: "Community",
    links: [
      ["Visitors' book", site.signBook],
      ["Patrons", "/#patrons"],
      ["Suggest an exhibit", site.suggestExhibit],
    ],
  },
];

export function Footer() {
  return (
    <footer className="sec">
      <div className="night">
        <div className="wrap">
          <div className="foot-cols">
            <div className="gift">
              <span className="mono">Exit through the gift shop</span>
              <div className="serif gift-title">Glint stickers, opening soon.</div>
              <div className="stickers" aria-hidden="true">
                <div style={{ transform: "rotate(-9deg)" }}>
                  <Glint pose="pearl" size={92} sticker />
                </div>
                <div style={{ transform: "rotate(6deg) translateY(-10px)" }}>
                  <Glint pose="headphones" size={92} sticker />
                </div>
                <div style={{ transform: "rotate(-4deg)" }}>
                  <Glint pose="shades" size={92} sticker />
                </div>
              </div>
            </div>
            {columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <span className="mono">{col.title}</span>
                <ul>
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <a href={href}>{label}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="giant-wrap" aria-hidden="true">
          <Wordmark className="giant" />
          <div className="sleeper">
            <Glint pose="asleep" size={120} sticker />
          </div>
        </div>

        <div className="wrap">
          <div className="foot-base">
            <span>The gallery is closed for the night. The website is not.</span>
            <span>© 2026 Bragkit · MIT licence · Curated by {site.curator}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
