import { Glint, Wordmark } from "../glint";
import { StarButton } from "../star-button";

export function Nav({ home = "" }: { home?: string }) {
  return (
    <div className="wrap nav-wrap">
      <header className="nav">
        <a href={home || "#top"} className="nav-home">
          <Glint pose="pearl" size={46} priority />
          <Wordmark size={25} />
        </a>
        <nav className="nav-links" aria-label="Main">
          <a href="/exhibits">Collection</a>
          <a href={`${home}#developers`}>Developers</a>
          <a href={`${home}#visit`}>Visit</a>
          <a href="/docs">Docs</a>
        </nav>
        <div className="nav-end">
          <StarButton />
        </div>
      </header>
    </div>
  );
}
