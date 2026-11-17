import type { Metadata } from "next";
import { Footer } from "@/components/sections/footer";
import { Nav } from "@/components/sections/nav";
import { codeFor, defaultText, registry, sharedProps, typeText } from "@/lib/exhibits";
import { site } from "@/lib/site";
import "../exhibits/exhibits.css";

export const metadata: Metadata = {
  title: "Docs — Bragkit",
  description: "Install Bragkit, add the stylesheet, hang an exhibit. Props for every exhibit and primitive.",
};

const setup = `${site.install}

// once, anywhere (your root layout is a good place)
import "bragkit/styles.css"

// then hang an exhibit
import { NowPlaying } from "bragkit"

<NowPlaying track="Baby" artist="Justin Bieber" progress={0.62} />`;

const theming = `/* Every colour, font and curve is a --bk- variable. Change them for the whole page... */
:root {
  --bk-font-sans: "Inter", sans-serif;
  --bk-font-serif: "Playfair Display", serif;
  --bk-lilac: #b9a2ff;
}

/* ...or on one exhibit. --bk-accent is its strong colour, --bk-scale its size. */
<NowPlaying style={{ "--bk-accent": "#ff6b00", "--bk-scale": 1.1 }} />

/* Dark: put data-theme="dark" on any ancestor, or pass theme="dark" | "auto". */
<html data-theme="dark">`;

const primitives = `import { Case, Placard, Plinth, Hang, BrassPlate, Medal, LiveDot } from "bragkit"

<Hang drop={80} sway={2}>
  <Case tone="mint">
    <Placard number="022" title="My own exhibit" medium="React, CSS" />
  </Case>
</Hang>

<Plinth><Medal>1.2k</Medal></Plinth>
<BrassPlate copy="npm i my-thing" />
<LiveDot>Live</LiveDot>`;

const primitiveRows: Array<[string, string]> = [
  ["Case", "The candy gradient card with a tinted shadow and a lit top edge. Takes tone."],
  ["Placard", "The museum label. Takes number, title, medium and note."],
  ["Plinth", "Stands any child on a contact shadow. The child lifts when hovered."],
  ["Hang", "Hangs any child from a brass nail on a wire. Takes drop, sway and duration."],
  ["BrassPlate", "The engraved brass button. Give it copy and it copies that text when pressed."],
  ["Medal", "The small brass chip for a count."],
  ["LiveDot", "The breathing green dot with a word beside it. For live data only."],
];

export default function Docs() {
  return (
    <>
      <Nav home="/" />
      <main className="wrap">
        <div className="docs-hero">
          <span className="mono">Docs · The catalogue</span>
          <h1 className="h2">
            How to hang <em>the exhibits.</em>
          </h1>
          <p className="lede">
            Install the package, import the stylesheet once, and hang an exhibit. Everything works from props, with no
            account and no keys, in React 18 and 19. To try the props by hand, visit{" "}
            <a href="/exhibits">the collection</a>.
          </p>
          <pre className="code-light">{setup}</pre>
        </div>

        <section className="docs-widget" id="theming">
          <div className="docs-copy">
            <span className="mono">Restyling</span>
            <h2>Theming</h2>
            <p>
              Bragkit ships no fonts and no colours you cannot change. Every token is a CSS variable with the prefix
              --bk-, so nothing collides with your own styles. Tones keep their colour in the dark; plain surfaces
              follow the theme. Motion stops for visitors who turn it off.
            </p>
            <p>
              Every exhibit takes size (sm, md, lg), theme, className and style, and most take a tone: apricot, lilac,
              mint, rose, cobalt or plain.
            </p>
          </div>
          <pre className="code-light">{theming}</pre>
        </section>

        <section className="docs-widget" id="primitives">
          <div className="docs-copy">
            <span className="mono">Building blocks</span>
            <h2>Primitives</h2>
            <p>The parts the exhibits are made of, for building your own in the same style.</p>
            <table className="props">
              <tbody>
                {primitiveRows.map(([name, note]) => (
                  <tr key={name}>
                    <td>
                      <code>{name}</code>
                    </td>
                    <td>{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <pre className="code-light">{primitives}</pre>
        </section>

        {registry.map((meta) => (
          <section className="docs-widget" key={meta.slug} id={meta.slug}>
            <div className="docs-copy">
              <span className="mono">
                No. {meta.number} · {meta.wing} Wing
              </span>
              <h2>{meta.name}</h2>
              <p>
                {meta.object} {meta.how}
              </p>
              <pre className="code-light">{codeFor(meta, meta.example)}</pre>
              <a className="btn btn-p btn-s docs-open" href={`/exhibits/${meta.slug}`}>
                Open its room
              </a>
            </div>
            <table className="props">
              <thead>
                <tr>
                  <th scope="col">Prop</th>
                  <th scope="col">Type</th>
                  <th scope="col">Notes</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(meta.props).map(([name, spec]) => (
                  <tr key={name}>
                    <td>
                      <code>{name}</code>
                    </td>
                    <td>
                      <code>{typeText(spec)}</code>
                    </td>
                    <td>
                      {spec.description}
                      {defaultText(spec) ? ` Default ${defaultText(spec)}.` : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}

        <section className="docs-widget" id="shared">
          <div className="docs-copy">
            <span className="mono">On every exhibit</span>
            <h2>Shared props</h2>
          </div>
          <table className="props">
            <tbody>
              {sharedProps.map(([name, type, note]) => (
                <tr key={name}>
                  <td>
                    <code>{name}</code>
                  </td>
                  <td>{type ? <code>{type}</code> : null}</td>
                  <td>{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
      <Footer />
    </>
  );
}
