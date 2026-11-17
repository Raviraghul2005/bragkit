import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExhibitRoom } from "@/components/exhibit-room";
import { ArrowRight } from "@/components/icons";
import { Footer } from "@/components/sections/footer";
import { Nav } from "@/components/sections/nav";
import { bySlug, defaultText, neighbours, registry, sharedProps, typeText } from "@/lib/exhibits";
import "../exhibits.css";

export function generateStaticParams() {
  return registry.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const meta = bySlug((await params).slug);
  if (!meta) return {};
  return { title: `No. ${meta.number} ${meta.name} — Bragkit`, description: meta.summary };
}

export default async function ExhibitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = bySlug(slug);
  if (!meta) notFound();
  const { prev, next } = neighbours(slug);

  return (
    <>
      <Nav home="/" />
      <main className="wrap xp">
        <header className="xp-head">
          <a className="mono xp-back" href="/exhibits">
            The collection
          </a>
          <span className="mono">
            No. {meta.number} · {meta.wing} Wing
          </span>
          <h1 className="h2">
            <em>{meta.name}</em>
          </h1>
          <p className="lede">{meta.summary}</p>
        </header>

        <ExhibitRoom meta={meta} />

        <section className="xp-notes">
          <div className="xp-how">
            <span className="mono">How it works</span>
            <dl>
              <dt>The object</dt>
              <dd>{meta.object}</dd>
              <dt>When touched</dt>
              <dd>{meta.moment}</dd>
              <dt>The data</dt>
              <dd>{meta.how}</dd>
            </dl>
            <pre className="code-light">{`import { ${meta.component} } from "bragkit"\n// or only this exhibit:\nimport { ${meta.component} } from "bragkit/${meta.slug}"`}</pre>
          </div>
          <div className="xp-props">
            <span className="mono">Props</span>
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
          </div>
        </section>

        <nav className="xp-walk" aria-label="Other exhibits">
          <a href={`/exhibits/${prev.slug}`}>
            <span className="mono">Previous room · No. {prev.number}</span>
            <b>{prev.name}</b>
          </a>
          <a href={`/exhibits/${next.slug}`} className="xp-walk-next">
            <span className="mono">Next room · No. {next.number}</span>
            <b>
              {next.name} <ArrowRight />
            </b>
          </a>
        </nav>
      </main>
      <Footer />
    </>
  );
}
