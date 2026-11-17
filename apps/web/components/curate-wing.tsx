"use client";

import { useState } from "react";
import { ExhibitView } from "./exhibit-view";
import { Glint } from "./glint";

/** "Curate your own wing": the handle drives the sign on the door and the signature. */
export function CurateWing() {
  const [handle, setHandle] = useState("ada");
  const name = handle || "your-name";

  return (
    <div className="g2 room-grid">
      <div className="stack-col" style={{ gap: 22 }}>
        <span className="mono">Try it</span>
        <h2 className="h2">
          Curate <em>your own wing.</em>
        </h2>
        <p className="lede">
          Type your name and watch the sign on the door change. This is what visitors to your portfolio will see.
        </p>
        <div className="field">
          <label className="field-label">
            <span className="mono">Your handle</span>
            <input
              type="text"
              value={handle}
              maxLength={20}
              autoComplete="off"
              spellCheck={false}
              onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 20))}
            />
          </label>
          <a className="btn btn-l" href="/exhibits">
            Pick exhibits
          </a>
        </div>
        <span className="small">The exhibits in the preview are real. The numbers are invented.</span>
      </div>

      <div className="browser">
        <div className="browser-bar">
          <i />
          <i />
          <i />
          <span className="url">{name}.dev</span>
        </div>
        <div className="browser-body">
          <div style={{ display: "grid", gap: 8 }}>
            <span className="mono">Now showing · 2 exhibits · Free entry</span>
            <div className="serif browser-title">The {name} Collection</div>
          </div>
          <div className="wing-floor">
            <ExhibitView slug="signature" size="sm" props={{ name: name, note: "Curator" }} />
            <ExhibitView slug="head-count" size="sm" />
          </div>
          <div className="curated">
            <Glint pose="pearl" size={34} />
            Curated with Bragkit
          </div>
        </div>
      </div>
    </div>
  );
}
