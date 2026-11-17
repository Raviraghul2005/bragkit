import { CopyButton } from "../copy-command";
import { Glint } from "../glint";

const meta = [
  ["Admission", "Free"],
  ["Valid", "Forever"],
  ["Seat", "Front row"],
  ["Dress code", "Shiny"],
];

export function GoldenTicket() {
  return (
    <section className="wrap sec sec-ticket">
      <div className="ticket">
        <div className="t-clip" aria-hidden="true">
          <span className="shine" />
        </div>
        <div className="t-perch" aria-hidden="true">
          <Glint pose="shades" size={190} sticker />
        </div>
        <div className="t-main">
          <span className="t-mono">Admit one · The Bragkit Gallery</span>
          <h2 className="t-h">
            Go on.
            <br />
            <em>Brag a little.</em>
          </h2>
          <dl className="t-meta">
            {meta.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="t-stub">
          <div style={{ display: "grid", gap: 6 }}>
            <span className="t-mono">Ticket</span>
            <span className="t-no">No. 000001</span>
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            <CopyButton />
            <a className="btn btn-ghost btn-block" href="#collection">
              Enter the gallery
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
