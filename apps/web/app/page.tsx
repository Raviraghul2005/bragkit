import { CurateWing } from "@/components/curate-wing";
import { Collection } from "@/components/sections/collection";
import { Developers } from "@/components/sections/developers";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { Nav } from "@/components/sections/nav";
import { GoldenTicket } from "@/components/sections/ticket";
import { BookAndPatrons, VisitorInformation } from "@/components/sections/visit";
import { registry } from "@/lib/exhibits";

const marquee = [...registry.slice(0, 10).map((m) => m.name), "Please touch the exhibits"];

export default function Home() {
  return (
    <div id="top">
      <Nav />
      <main>
        <Hero />

        <div className="mq" aria-hidden="true">
          <div className="mq-in">
            {[...marquee, ...marquee].map((m, i) => (
              <span key={i} className="mq-item">
                <span>{m}</span>
                <i />
              </span>
            ))}
          </div>
        </div>

        <Collection />

        <section className="wrap sec">
          <div className="room">
            <CurateWing />
          </div>
        </section>

        <Developers />
        <VisitorInformation />
        <BookAndPatrons />
        <GoldenTicket />
      </main>
      <Footer />
    </div>
  );
}
