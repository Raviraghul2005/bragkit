import { ExhibitView } from "../exhibit-view";
import { ArrowRight } from "../icons";
import { bySlug, registry } from "@/lib/exhibits";

// Six highlights, in hanging order. The full collection is at /exhibits.
const highlights: Array<{ slug: string; tone: string; span: string }> = [
  { slug: "now-playing", tone: "c-ap", span: "s2" },
  { slug: "status-card", tone: "c-li", span: "s2" },
  { slug: "open-for-work", tone: "c-pl", span: "s2" },
  { slug: "trophy-case", tone: "c-ro", span: "s2" },
  { slug: "visitors-book", tone: "c-mi", span: "s2" },
  { slug: "head-count", tone: "c-pl", span: "s2" },
];

export function Collection() {
  const shown = highlights.flatMap((h) => {
    const meta = bySlug(h.slug);
    return meta ? [{ ...h, meta }] : [];
  });

  return (
    <section className="wrap sec" id="collection">
      <div className="head">
        <div className="head-title">
          <span className="mono">The permanent collection</span>
          <h2 className="h2">
            Please touch
            <br />
            <em>the exhibits.</em>
          </h2>
        </div>
        <p className="lede">
          Each exhibit is a real object: it is lit from above, it stands on its own shadow, and it does one thing
          when you touch it. Each is its own import, so you only ship what you hang.
        </p>
      </div>

      <div className="bento">
        {shown.map(({ slug, tone, span, meta }) => (
          <div className={`case ${tone} ${span} hl`} key={slug}>
            <span className="mono">No. {meta.number}</span>
            <h3>
              <a href={`/exhibits/${slug}`}>{meta.name}</a>
            </h3>
            <p>{meta.summary}</p>
            <div className="hl-floor">
              <ExhibitView slug={slug} />
            </div>
          </div>
        ))}
      </div>

      <div className="browse">
        <a className="btn btn-p" href="/exhibits">
          See the full collection ({registry.length} exhibits)
          <ArrowRight />
        </a>
      </div>
    </section>
  );
}
