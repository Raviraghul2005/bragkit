import { github } from "bragkit/logos";
import { Glint, Wordmark } from "../glint";
import { Torch } from "../torch";
import { site } from "@/lib/site";

type FootLink = { label: string; href: string; external?: boolean };

const columns: { title: string; links: FootLink[] }[] = [
  {
    title: "Collection",
    links: [
      { label: "Now Playing", href: "/exhibits#now-playing" },
      { label: "Shipping Streak", href: "/exhibits#streak" },
      { label: "Local Time", href: "/exhibits#local-time" },
      { label: "Status Card", href: "/exhibits#status-card" },
      { label: "Tech Stack Keyboard", href: "/exhibits/tech-stack" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "GitHub", href: site.repo, external: true },
      { label: "Issues", href: site.issues, external: true },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Visitors' book", href: site.signBook, external: true },
      { label: "Patrons", href: "/#patrons" },
      { label: "Suggest an exhibit", href: site.suggestExhibit, external: true },
    ],
  },
];

function Arrow({ up = false }: { up?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={14}
      height={14}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {up ? <path d="M12 19V5M5 12l7-7 7 7" /> : <path d="M7 17 17 7M8 7h9v9" />}
    </svg>
  );
}

export function Footer() {
  return (
    <footer>
      <Torch>
        <div className="wrap">
          <div className="foot-top">
            <div className="foot-brand">
              <a href="#top" className="foot-logo" aria-label="bragkit, back to the top">
                <Glint pose="pearl" size={44} sticker />
                <Wordmark size={30} />
              </a>
              <p>Your wins, on display. A small gallery of exhibits for your portfolio.</p>
              <a className="foot-icon" href={site.repo} aria-label="bragkit on GitHub">
                <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor" aria-hidden="true">
                  <path d={github.path} />
                </svg>
              </a>
            </div>

            {columns.map((col) => (
              <nav key={col.title} className="foot-col" aria-label={col.title}>
                <span className="foot-label">{col.title}</span>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href}>
                        {l.label}
                        {l.external ? (
                          <>
                            <Arrow />
                            <span className="sr-only"> (opens GitHub)</span>
                          </>
                        ) : null}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div className="foot-gift">
              <span className="foot-label">Exit through the gift shop</span>
              <div className="serif foot-gift-title">Glint stickers, opening soon.</div>
              <div className="stickers" aria-hidden="true">
                <div style={{ transform: "rotate(-9deg)" }}>
                  <Glint pose="pearl" size={64} sticker />
                </div>
                <div style={{ transform: "rotate(6deg) translateY(-6px)" }}>
                  <Glint pose="headphones" size={64} sticker />
                </div>
                <div style={{ transform: "rotate(-4deg)" }}>
                  <Glint pose="shades" size={64} sticker />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="giant-wrap" aria-hidden="true">
          <div className="floor">
            <Wordmark className="giant" />
          </div>
        </div>

        <div className="wrap">
          <div className="foot-base">
            <span>© 2026 Bragkit · MIT licence · Curated by {site.curator}</span>
            <span>The gallery is closed for the night. The website is not.</span>
            <a className="to-top" href="#top">
              Back to the entrance
              <Arrow up />
            </a>
          </div>
        </div>
      </Torch>
    </footer>
  );
}
