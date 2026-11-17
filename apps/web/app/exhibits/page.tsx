import type { Metadata } from "next";
import { CopyPlate } from "@/components/copy-command";
import { GalleryWall } from "@/components/gallery-wall";
import { Footer } from "@/components/sections/footer";
import { Nav } from "@/components/sections/nav";
import { registry } from "@/lib/exhibits";
import "./exhibits.css";

export const metadata: Metadata = {
  title: "The collection — Bragkit",
  description: "Every Bragkit exhibit, live. Touch it, open its room, change the props, copy the code.",
};

export default function Exhibits() {
  return (
    <>
      <Nav home="/" />
      <main className="wrap gw">
        <header className="gw-head">
          <span className="mono">The permanent collection · {registry.length} exhibits</span>
          <h1 className="h2">
            Take one <em>home with you.</em>
          </h1>
          <p className="lede">
            Everything on this wall is live. Touch it here, open its room to change the props, and copy the code when
            it looks right. The data in the demos is invented.
          </p>
          <div className="cta-row gw-cta">
            <CopyPlate />
            <a className="btn btn-p" href="/docs">
              Read the docs
            </a>
          </div>
        </header>
        <GalleryWall />
      </main>
      <Footer />
    </>
  );
}
