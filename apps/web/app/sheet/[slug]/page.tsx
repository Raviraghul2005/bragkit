import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExhibitView } from "@/components/exhibit-view";
import { bySlug, registry } from "@/lib/exhibits";
import "../../exhibits/exhibits.css";

// The contact sheet: one exhibit at every size, in light and dark, and in a 320px column.
// A review page for the quality bar. It is not linked from the site.
export const metadata: Metadata = { title: "Contact sheet — Bragkit", robots: { index: false } };

export function generateStaticParams() {
  return registry.map((m) => ({ slug: m.slug }));
}

const sizes = ["sm", "md", "lg"] as const;

export default async function Sheet({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = bySlug(slug);
  if (!meta) notFound();

  return (
    <main className="sheet">
      <p className="mono">
        No. {meta.number} · {meta.name} · contact sheet
      </p>
      {(["light", "dark"] as const).map((theme) => (
        <section key={theme} className="sheet-row" data-theme={theme} id={theme}>
          {sizes.map((size) => (
            <div className="sheet-cell" key={size}>
              <span className="mono">
                {theme} · {size}
              </span>
              <ExhibitView slug={slug} size={size} />
            </div>
          ))}
        </section>
      ))}
      <section className="sheet-row sheet-narrow" data-theme="light" id="narrow">
        <div className="sheet-cell sheet-320">
          <span className="mono">320px wide</span>
          <ExhibitView slug={slug} />
        </div>
      </section>
    </main>
  );
}
