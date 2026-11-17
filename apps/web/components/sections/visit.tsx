import { VisitorsBook } from "bragkit";
import { site } from "@/lib/site";

const info: [string, string, string][] = [
  ["Opening hours", "Always.", "It is a website."],
  ["Admission", "Free.", "MIT licence, no account."],
  ["Getting here", `${site.install}.`, "pnpm, yarn and bun also know the way."],
  ["What to bring", "React 18 or 19.", "Next.js, Vite and Astro are all welcome."],
  ["Photography", "Encouraged.", "Post your gallery and tag Bragkit."],
  ["After hours", "Dark theme included.", "The exhibits keep their colours."],
  ["Accessibility", "Keyboard friendly.", "Calm for people who turn motion off."],
  ["Lost property", "Found a bug?", "Hand it in on GitHub Issues."],
];

export function VisitorInformation() {
  return (
    <section className="wrap sec" id="visit">
      <div className="head">
        <div className="head-title">
          <span className="mono">Front desk</span>
          <h2 className="h2">
            Visitor <em>information.</em>
          </h2>
        </div>
        <p className="lede">Everything people usually ask before they walk in.</p>
      </div>
      <dl className="info">
        {info.map(([term, main, aside]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd>
              {term === "Lost property" ? (
                <>
                  {main} <a href={site.issues}>Hand it in on GitHub Issues.</a>
                </>
              ) : (
                <>
                  {main} <span>{aside}</span>
                </>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function BookAndPatrons() {
  return (
    <section className="wrap sec">
      <div className="g2">
        <div className="case c-pl case-split">
          <div className="case-body">
            <span className="mono">Visitors&apos; book</span>
            <h3>Opening night.</h3>
            <p>Be the first to sign it with your name and your portfolio. It is the same book you can put on your own site.</p>
            <div className="book-floor">
              <VisitorsBook entries={[]} size="sm" tone="plain" />
            </div>
          </div>
          <a className="btn btn-l case-cta" href={site.signBook}>
            Sign the book
          </a>
        </div>
        <div className="case c-ro case-split" id="patrons">
          <div className="case-body">
            <span className="mono">Patrons</span>
            <h3>Your name on the wall.</h3>
            <p>Bragkit is free and built in the open. Patrons get a brass plate in the lobby and Glint&apos;s lasting respect.</p>
            <div className="plates">
              <span className="plate plate-sm">Your name here</span>
              <span className="plate plate-sm">And here</span>
              <span className="plate plate-sm">Room for one more</span>
            </div>
          </div>
          <span className="mono case-cta">Patronage opens after the first release</span>
        </div>
      </div>
    </section>
  );
}
