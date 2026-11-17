# Bragkit

Bragkit is an open-source kit of React exhibits people put on their portfolio to show off: what they are playing, what they are shipping, what time it is where they are. Each exhibit is a small physical object that does one thing when touched. One import per exhibit. MIT licence.

This file is the design and project brief. Read it before building anything. These files are the source of truth:

| File | Use it for |
|---|---|
| `design/tokens.css` | Every colour, font, shadow, radius, spacing and motion value for the site. Never hardcode a value that has a token. The site uses a copy at `apps/web/app/tokens.css`; keep the two in sync. |
| `packages/bragkit/src/tokens.css` | The same values for the package, every one prefixed `--bk-`. Exhibits use only these. Keep the values in step with `design/tokens.css`. |
| `COLLECTION.md` | The brief for exhibits: the foundation, the design language, the quality bar and the full list. |
| `COLLECTION-LOG.md` | The running record: decisions, quality scores, sizes, what was cut, ideas held back. Update it when you add or change an exhibit. |
| `design/landing-page.html` | The approved landing page design (static HTML + CSS, sample data). Open it in a browser. Rebuild it as React; match the look, the class names are free to change. |
| `design/assets/glint-*.svg` | Glint, the mascot, in 4 poses. `favicon.svg` is the site icon. The site serves copies from `apps/web/public/assets/`, and `apps/web/app/icon.svg` is the favicon. |
| `PLAN.md` | What is done, what is next, the list of exhibits, and the promises the site makes that the package must keep. |

## Commands

Run from the repo root:

- `npm run dev`: builds the package, then runs `tsup --watch` and `next dev` together (http://localhost:3000).
- `npm run build`: builds the package, then the site.
- `npm run build:pkg`: builds only the package, to `packages/bragkit/dist`.
- `npm run typecheck`: runs type checks in every workspace.
- `npm test -w bragkit`: runs the package tests (every exhibit is rendered to HTML).
- `npm run sizes -w bragkit`: builds and prints the gzipped size of each exhibit.
- `node scripts/dev-alt.mjs`: runs the site alone on port 3100 with its own build folder, beside a running `npm run dev`. It does not watch the package; run `npm run build:pkg` after package changes.

The site imports the package from its built `dist`, so the package must build before the site. `apps/web` has a `prebuild` script that does this, so the site also builds on its own (Vercel root directory: `apps/web`).

Fonts load through `next/font/google` in `apps/web/app/layout.tsx`. `globals.css` points `--font-sans`, `--font-serif` and `--font-mono` at the generated families.

## Repo shape

One repo, npm workspaces, two parts:

- `apps/web` — the website and docs. Next.js (App Router), TypeScript, deployed on Vercel.
- `packages/bragkit` — the npm package `bragkit`. TypeScript, bundled with tsup to ESM + CJS with type files, React 18 and 19 as peer dependencies, no other runtime dependencies.

Inside the package:

- `src/exhibits/<slug>/` holds one exhibit: `Component.tsx`, `<slug>.css`, `meta.ts` (registry entry: number, wing, props, example data) and a test.
- `src/primitives/` holds the building blocks: `Case`, `Placard`, `Plinth`, `Hang`, `BrassPlate`, `Medal`, `LiveDot`.
- `src/tokens.css`, `src/base.css` and `src/styles.css` are the styles. Users import `bragkit/styles.css` once. There is no CSS-in-JS.
- `src/registry.ts` lists every exhibit's meta. The website builds `/exhibits`, each `/exhibits/[slug]` room and `/docs` from it.
- To add an exhibit: create its folder, then add it to `src/index.ts`, `src/registry.ts` and `src/styles.css`. A test fails if one is missed.

Rules for package code:

- Every class starts with `bk-` and every variable with `--bk-`. A test checks this.
- Every exhibit takes `size`, `theme`, `className`, `style` and `id`, and `tone` where colour makes sense. Lengths inside an exhibit are in `em`, so `--bk-scale` sizes the whole thing.
- Write `"use client"` only in exhibits that need the browser. The build marks the right output files.
- The resting state in CSS is always the finished state. Animations only run from an earlier state, so reduced motion (which switches animations off) never hides anything.
- Anything the server cannot know (the visitor's clock) renders a same-size placeholder first.
- Each exhibit imports from `"bragkit"` or from its own entry: `"bragkit/now-playing"`.

## The idea: a small gallery

Bragkit puts your wins on display, so the site is a small museum. The page is the quiet white room. The widgets are the exhibits: they carry all the colour, motion and attention. If something is not an exhibit, make it quieter.

Six signatures make a screen look like Bragkit. Use them; do not invent new ones without asking.

1. **Picture rail and hanging frames.** In the hero a thin brass rail runs across the page and the widgets hang from it on wires, swaying a little (see `.rail`, `.hang`, `.wire`, `.frame`).
2. **Candy cases.** Feature blocks are soft gradient cards (lighter at the top, richer at the bottom) with a shadow tinted in their own colour: apricot, lilac, mint, rose, and one cobalt case per page for the developer pitch.
3. **Brass.** The install command sits on an engraved brass plate with two screws. Star counts are small brass medals. The final call to action is a golden ticket. Brass is used nowhere else.
4. **Museum voice.** Exhibits are numbered ("No. 001"), their titles are set in italic serif like artwork titles, and the copy is dry and short.
5. **Glint.** A magpie who collects shiny things. He appears a few times per page, always doing something that fits the spot (headphones by the music widget, sunglasses on the ticket, asleep in the footer).
6. **After hours.** The footer is the only dark area: black room, warm spotlight, giant brass wordmark.

## Type

- `--font-sans` (Geist): everything by default. Headlines are large, weight 450, tight tracking (-0.045em to -0.055em), normal width. Never bold a headline, never condense it.
- `--font-serif` (Instrument Serif, italic only): exhibit titles, and exactly one accent word or phrase per headline ("Show off, *tastefully.*").
- `--font-mono` (Geist Mono): numbers, code, the install command, and small uppercase labels with letter-spacing 0.06em.
- Body text is `--ink-soft`, 17–21px, at most about 34em wide.

## Colour

- Page is `--wall` (white). Text is `--ink` for headings and `--ink-soft` for everything else. `--ink-faint` is decoration only, never text.
- Colour lives inside cases, frames and widgets. Never colour running text, never tint the page background.
- Text on apricot, lilac, mint and rose is `--on-case` / `--on-case-soft`. Text on cobalt is white.
- `--live` green means live data only: the small pulsing dot, always beside a word.
- Primary button is `--lacquer` (near black) with `--on-lacquer` text. One per view.

## Depth and motion

- One light source from above. Raised things get a 1px light top edge and layered soft shadows (the `--shadow-*` tokens). Objects in a case cast shadows in the case's `-shade` colour.
- Hover lifts an object about 10px on `--ease-lift` (a small spring). Presses go down 1px. Brass gets one shine sweep on hover.
- Hanging frames sway slowly and forever; the record in Now Playing spins; the marquee scrolls. Everything else is still until touched.
- Honour `prefers-reduced-motion`: no sway, spin, marquee or lift.

## Voice

The curator: dry, short, quietly proud. Museum words for normal things: exhibits (widgets), the collection, "12 in the gallery" (visitors), visitors' book (guestbook), patrons (sponsors), "Visitor information" (FAQ).

- Sentence case. No exclamation marks, no emoji, no hype words.
- `bragkit` lowercase in code and the wordmark, Bragkit in prose.
- Do not invent testimonials, user counts or stats. Empty states are honest ("The book is still empty").

## Glint

- Use the SVG files as they are. Do not redraw or recolour him.
- Poses: `pearl` (default), `headphones` (music), `shades` (launches, the ticket, developers), `asleep` (footer, 404, empty states).
- On coloured or dark backgrounds add the sticker shadow (`.stk` in the reference). He already has a white outline.
- In the wordmark, the dot of the "i" is his brass pearl (see `.wm` in the reference).

## Rules that matter

- Works at phone width (single column), keyboard reachable, visible focus ring, text contrast 4.5:1.
- Real `<button>` and `<a>` elements. Icons are 1.5px line icons (Lucide style).
- No third-party logos, with two exceptions the owner asked for. The GitHub mark sits on the Star button in the nav, in the button's own colour, linking to the repo. And the Tech Stack Keyboard shows the real logos of the tools on it, unaltered and in their brand colour (data from Simple Icons, CC0). A logo too pale for a cream key gets a dark key; the logo is never recoloured. Nowhere else. No real album art and no photos of real people.
- Demo data on the site comes from each exhibit's `example` in its `meta.ts`. It is invented and must not be presented as the maintainer's own. The live dot and the word "Live" appear only for data that is live.
- Every exhibit is one real-world object with one signature moment. Check new ones against the quality bar in `COLLECTION.md` and record the scores in `COLLECTION-LOG.md`.

## Git rules

Never add "Co-Authored-By", "Generated with Claude Code" or any Claude attribution to commit messages or pull requests.
