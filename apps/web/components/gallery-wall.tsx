"use client";

import { useState } from "react";
import { ExhibitView } from "./exhibit-view";
import { Glint } from "./glint";
import { ArrowRight } from "./icons";
import { registry, wings } from "@/lib/exhibits";
import { site } from "@/lib/site";

type Filter = "All" | (typeof wings)[number]["name"];

/** The floor of the collection: every exhibit in the registry, live, filtered by wing. */
export function GalleryWall() {
  const [wing, setWing] = useState<Filter>("All");
  const shown = registry.filter((m) => wing === "All" || m.wing === wing);
  const about = wings.find((w) => w.name === wing);

  return (
    <>
      <div className="gw-filter">
        <div className="gw-seg" role="group" aria-label="Filter by wing">
          {(["All", ...wings.map((w) => w.name)] as Filter[]).map((name) => (
            <button key={name} type="button" aria-pressed={wing === name} onClick={() => setWing(name)}>
              {name}
              <span>{name === "All" ? registry.length : registry.filter((m) => m.wing === name).length}</span>
            </button>
          ))}
        </div>
        <span className="mono gw-about" aria-live="polite">
          {about ? `${about.title} · ${about.about}` : "All four wings"}
        </span>
        <div className="gw-glint" aria-hidden="true">
          <Glint pose="pearl" size={84} />
        </div>
      </div>

      <div className="gw-wall">
        {shown.map((meta) => (
          <article className="gw-tile" key={meta.slug}>
            <div className="gw-stand">
              <ExhibitView slug={meta.slug} />
            </div>
            <a className="gw-card" href={`/exhibits/${meta.slug}`}>
              <span className="mono">
                No. {meta.number} · {meta.wing} Wing
              </span>
              <b>{meta.name}</b>
              <small>{meta.summary}</small>
              <span className="gw-go">
                Open its room <ArrowRight />
              </span>
            </a>
          </article>
        ))}

        <a className="gw-tile gw-open" href={site.suggestExhibit}>
          <span className="mono">Open call</span>
          <b>Suggest an exhibit</b>
          <small>
            Name the object and the one thing it does when touched. The good ones get a number and a place on this wall.
          </small>
          <span className="gw-go">
            Pitch No. {String(Number(registry[registry.length - 1]?.number ?? 0) + 1).padStart(3, "0")} <ArrowRight />
          </span>
        </a>
      </div>
    </>
  );
}
