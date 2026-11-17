import { CopyPlate } from "../copy-command";
import { Glint } from "../glint";
import { Check } from "../icons";

const facts = [
  "Typed props with autocomplete",
  "You only ship the exhibits you import",
  "Restyle everything with CSS variables",
];

export function Developers() {
  return (
    <section className="wrap sec" id="developers">
      <div className="case c-co dev-case">
        <div className="g2 room-grid">
          <div className="stack-col" style={{ gap: 20 }}>
            <span className="mono">For developers</span>
            <h2 className="h2">
              Hung in <em>three lines.</em>
            </h2>
            <p className="dev-lede">
              Import the stylesheet once, then the exhibits you want. Everything works from props: no keys, no
              account, no server.
            </p>
            <ul className="facts">
              {facts.map((f) => (
                <li key={f}>
                  <Check />
                  {f}
                </li>
              ))}
            </ul>
            <div className="cta-row" style={{ marginTop: 12, justifyContent: "flex-start" }}>
              <CopyPlate />
              <a className="btn btn-p" href="/docs">
                Read the docs
              </a>
            </div>
          </div>
          <div className="code-col">
            <div className="perch" aria-hidden="true">
              <Glint pose="shades" size={160} sticker />
            </div>
            <pre className="code">
              <em>import</em> {"{ NowPlaying, ShippingStreak, LocalTime }"} <em>from</em> {'"bragkit"'}
              {"\n"}
              <em>import</em> {'"bragkit/styles.css"'}
              {"\n\n"}
              <em>export default function</em> {"About() {\n  "}
              <em>return</em>
              {" (\n    <section>\n      "}
              <mark>{'<NowPlaying track="Baby" artist="Justin Bieber" />'}</mark>
              {"\n      "}
              <mark>{'<ShippingStreak start="2026-09-29" />'}</mark>
              {"\n      "}
              <mark>{'<LocalTime zone="Europe/Lisbon" />'}</mark>
              {"\n    </section>\n  )\n}"}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
