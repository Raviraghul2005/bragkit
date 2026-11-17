import type { CSSProperties, ReactNode } from "react";
import { CopyPlate } from "../copy-command";
import { ExhibitView } from "../exhibit-view";
import { Glint } from "../glint";
import { ArrowRight } from "../icons";

interface HangProps {
  side: "left" | "right";
  /** Distance from the page edge: [minimum, offset from centre]. */
  inset: [string, number];
  drop: number;
  from: number;
  to: number;
  dur: number;
  z: number;
  children: ReactNode;
}

/** A frame hanging from the rail on a wire, swaying slowly. */
function Hang({ side, inset, drop, from, to, dur, z, children }: HangProps) {
  const style = {
    [side]: `max(${inset[0]}, calc(50% - ${inset[1]}px))`,
    zIndex: z,
    "--drop": `${drop}px`,
    "--a": `${from}deg`,
    "--b": `${to}deg`,
    "--dur": `${dur}s`,
  } as CSSProperties;
  return (
    <div className="hang" style={style}>
      <i className="wire" aria-hidden="true" />
      <i className="nail" aria-hidden="true" />
      {children}
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero">
      <div className="rail" aria-hidden="true" />

      <div className="hero-copy">
        <h1 className="h1">
          Show off,
          <br />
          <em>tastefully.</em>
        </h1>
        <p className="lede" style={{ maxWidth: "27em" }}>
          Bragkit is a kit of exhibits for your portfolio: objects that show what you are playing, what you are
          shipping, what time it is where you are. One import each.
        </p>
        <div className="cta-row">
          <CopyPlate />
          <a className="btn btn-l" href="#collection">
            Enter the gallery
            <ArrowRight />
          </a>
        </div>
        <span className="small">MIT licence · React 18 and 19 · No account needed</span>
      </div>

      <div className="hangs">
        <Hang side="left" inset={["2%", 650]} drop={84} from={-2.4} to={1} dur={6.5} z={2}>
          <ExhibitView slug="now-playing" size="sm" />
        </Hang>
        <Hang side="left" inset={["4.5%", 618]} drop={452} from={1.6} to={-1.2} dur={8} z={1}>
          <ExhibitView slug="shipping-streak" size="sm" />
        </Hang>
        <Hang side="right" inset={["2%", 650]} drop={196} from={2} to={-1.4} dur={7.4} z={2}>
          <div className="perched">
            <ExhibitView slug="local-time" size="sm" />
            <div className="bird" aria-hidden="true">
              <Glint pose="pearl" size={108} sticker />
            </div>
          </div>
        </Hang>
        <Hang side="right" inset={["4.5%", 618]} drop={478} from={-1.8} to={1.4} dur={9} z={1}>
          <ExhibitView slug="status-card" size="sm" />
        </Hang>
      </div>
    </section>
  );
}
