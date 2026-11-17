# Collection log

The running record of the Collection Build (see `COLLECTION.md`). If a session stops halfway, start here.

## State report (audit, 15 Nov 2026)

**The package (`packages/bragkit`)**: five real components (NowPlaying, Streak, LocalTime, StatusCard, TechStack), each with tested logic. They work, but:

- They are flat cards (label, number, bar). None reads as a real object and none has a signature moment.
- Styles are injected as `<style>` tags from JS strings, and they read unprefixed tokens (`--ink`, `--wall`). A library must not collide with the user's names.
- No `size` prop, no `theme` prop, no primitives, no registry, no subpath exports, one bundle with a blanket `"use client"`.
- Tests cover logic only; nothing renders a component.

**The website (`apps/web`)**: the landing page widgets are real imported components, not fake markup. Problems found in the browser (1440, 1024, 390, light and dark):

1. Now Playing shows a real album cover with a photo of a real person (`public/assets/now-playing-cover.png`). The brief forbids this. Removed: the file is deleted and the sleeve is now drawn in CSS.
2. The hero Streak reads the maintainer's real GitHub and shows "1 day" with six empty tiles. Honest, but weak, and the demo should not be the maintainer's data. Demos now use each exhibit's invented example data.
3. The collection copy says "Five widgets at opening. Each one reads live data". Only the streak and the clock were live. Rewritten.
4. `/exhibits` is one long column of form cards. It is a settings page, not a gallery. Rebuilt as a gallery wall with a page per exhibit.
5. At 390px the hero widgets are squeezed into two tiny columns. Fixed: one column, each exhibit at its own width.
6. Dark theme: tokens exist and the page holds up, but there is no way to switch. The exhibit pages now have a light/dark preview toggle; a site-wide switch is left for later.
7. The hero, the brass plate, the golden ticket and the footer are good. Kept.

**Build**: `npm run build` passes, 29 logic tests pass.

## Decisions

- **One stylesheet.** `import "bragkit/styles.css"` once. No CSS-in-JS. Per-exhibit files also ship at `bragkit/css/<slug>.css` (with `bragkit/css/base.css`) for people who want the minimum.
- **Tokens** are `--bk-*`, set on `:root`. Dark values apply under any `[data-theme="dark"]` ancestor, or with `theme="dark"`; `theme="auto"` follows the system. No `theme` prop means "follow the page".
- **Materials keep their colour in the dark.** Paper, brass, felt, enamel and the candy tones stay as they are (a lit object in a dark room). Only `plain` surfaces and text that sits on the wall follow the theme.
- **Sizes** are one variable: `--bk-scale` (sm 0.8, md 1, lg 1.25). Every length inside an exhibit is in `em`, so anything scales, and people can set their own scale.
- **Tone** sets four variables (`--bk-t-top`, `--bk-t`, `--bk-t-shade`, `--bk-t-deep`). `--bk-accent` overrides the strong colour of any exhibit.
- **`"use client"`** is written only in the files that need it. The build adds it to the matching output files, so static exhibits stay server components.
- **Tests** render every exhibit to HTML with `react-dom/server` (no props, then example props) and check that an animated exhibit's stylesheet handles reduced motion. No DOM library was added.
- **Dev dependency added: `esbuild`** (already installed through tsup; now named directly). It bundles and minifies the CSS. No runtime dependencies.
- **Screenshots** are taken with headless Edge through the DevTools protocol (a small script outside the repo), so Playwright was not added.
- `Streak` is now `ShippingStreak` (`Streak` stays as an alias). `hour12` on LocalTime became `format="12h" | "24h"`.

- **Tech Stack Shelf shows real logos (owner's request, 15 Nov).** The lettered blocks were rejected. It is now small framed logos on a picture ledge. The logo data comes from Simple Icons (CC0-1.0), copied into `src/exhibits/tech-stack/logos.ts` by `scripts/gen-logos.mjs`; `simple-icons` is a dev dependency only, so there is still no runtime dependency. Logos are drawn unaltered in the brand's own colour, inside the exhibit that is about those tools. Cost: the 53 built-in logos are about 25 KB gzipped, well over the 4 KB target. They never reach the browser when TechStack is used as a server component (Next.js App Router). For the small path there is `TechShelf` plus single logos from `bragkit/logos`.
- **The landing page reads the registry.** The hero frames and the highlights use each exhibit's example data, so adding or rebuilding an exhibit needs no site edits.
- **Client chunks.** The build output is split into shared chunks, so `scripts/finish-build.mjs` marks every chunk that defines a client component or uses browser-only hooks with `"use client"`. Static exhibits (Now Playing, Tech Stack) stay server components.

## Exhibits

Scores are for the eight questions in the quality bar, in order (screenshot-worthy, real object, signature moment, dark, small sizes, calm type, clear props, family). All were checked at sm, md and lg, light and dark, and in a 320px column. Sizes are the exhibit imported alone, minified and gzipped, without React.

| No. | Exhibit | Status | Scores (1–8) | JS gzip | CSS gzip | Notes |
|---|---|---|---|---|---|---|
| 001 | Now Playing | done | 4.5 5 4.5 4 4.5 5 5 5 | 0.7 KB | 1.2 KB | Server component. Sleeve art is drawn from the tone; no album art. |
| 002 | Shipping Streak | done | 4 4 4 4.5 4.5 5 4 5 | 1.9 KB | 0.7 KB | Wall is drawn in the browser (needs the visitor's date). GitHub mode is the only live path. |
| 003 | Local Time | done | 5 5 4 5 4.5 4.5 4.5 5 | 1.9 KB | 1.1 KB | Sky follows the clock, not real sunrise times. `at` fixes the moment for demos and tests. |
| 004 | Status Card | done | 5 5 4.5 5 4.5 4 5 4.5 | 1.5 KB | 0.7 KB | Departures board. Flips when it scrolls into view and when the title changes. |
| 005 | Tech Stack Shelf | done (redone once) | 4.5 4.5 4 5 4.5 5 5 5 | 25.8 KB with all logos | 0.8 KB | Real logos, see Decisions. Drag to reorder not built. |
| 006 | Open For Work | done | 5 5 5 4.5 4.5 5 5 5 | 0.8 KB | 1.2 KB | Door sign. Turning it is local to the visitor. |
| 007 | Currently Reading | done | 4.5 4.5 4.5 4.5 4 5 5 4.5 | 0.8 KB | 1.4 KB | Built in the second pass (16 Nov). A real 3D box: the cover is the side of the spine. No cover image. Server component. |
| 008 | Coding Today | done (one redesign round) | 4.5 5 4.5 4.5 4 5 5 4.5 | 0.9 KB | 0.8 KB | Labels moved to the far end of each chip so they show when the deck fans. Server component. |
| 009 | Contribution Tapestry | done (one redesign round) | 4 4.5 4 4.5 4 5 4.5 4.5 | 1.3 KB | 1.1 KB | First version read as a grid with a rod; added hem, band, fringe and undyed thread. Default 26 weeks so it fits a phone. Server component. |
| 010 | Trophy Case | done | 5 5 4.5 5 4.5 5 4.5 5 | 1.7 KB | 1.2 KB | Ten built-in line icons. Brass rims count as trophies. |
| 011 | Ship Log | done | 4 4 4 4.5 4.5 5 5 5 | 0.9 KB | 0.8 KB | The quietest exhibit: no card, just rail, pins and type. |
| 012 | Stats Plaque | done | 4.5 5 4.5 5 4.5 4.5 5 5 | 1.2 KB | 0.9 KB | Counts text like 1.2k and 99.9% too. |
| 013 | Pinned Repo | done | 4.5 5 4 4.5 4.5 5 5 5 | 1.3 KB | 0.9 KB | Nothing is fetched; numbers are props. |
| 014 | Polaroid Stack | done | 4.5 4.5 4 4.5 4 4.5 5 4.5 | 0.9 KB | 1.2 KB | Built in the second pass. Four abstract prints drawn in CSS stand in for photos, so the demo uses no real pictures. |
| 015 | Calling Cards | done (one redesign round) | 4 4.5 4.5 4.5 4 5 5 4.5 | 0.5 KB | 0.8 KB | At rest the top card now sits straight. Words, not logos. Server component. |
| 016 | Signature | done | 4 4.5 4.5 4.5 4 4.5 5 4.5 | 1.0 KB | 0.8 KB | Name mode uses a script face from the visitor's device, so it varies by system. `path` mode is exact. |
| 017 | Postcard | done | 4.5 4.5 4.5 4.5 4 5 5 4.5 | 0.8 KB | 1.3 KB | Picture and stamp drawn in CSS. The hidden side is out of the tab order. |
| 018 | Desk Setup | done | 4 4 4.5 4 4 5 5 4.5 | 1.4 KB | 0.8 KB | Built in the second pass. Ten line drawings. The plainest of the set: line art, not a lit object. Server component. |
| 019 | Visitors' Book | done (one redesign round) | 4.5 4.5 4.5 4.5 4 4.5 4.5 4.5 | 1.4 KB | 1.7 KB | Stores nothing; `onSign` hands over each entry. On the site signing is a demo and nothing is saved. |
| 020 | Head Count | done | 4.5 5 4.5 4.5 4.5 5 5 5 | 1.0 KB | 0.8 KB | Counts nothing itself; you pass the number. |
| 021 | Days Since | done | 4.5 4.5 4.5 4.5 4.5 5 5 5 | 1.6 KB | 0.8 KB | Shares the split-flap cell with the Status Card. |

All CSS together (`bragkit/styles.css`) is 14.2 KB gzipped; the shared base is 3.5 KB.

The scores are my own reading of the screenshots. Question 3 (smooth at 60 fps) was judged from stills taken mid-motion, not from a frame-rate measurement.

## The site

- `/exhibits` is a salon hang built from the registry: columns of different heights, a placard under each exhibit, a filter by wing, Glint at the end of the filter row, and a "Suggest an exhibit" card that opens the issue template.
- `/exhibits/[slug]` is a room per exhibit: live preview with light/dark and S/M/L, a props panel built from `meta.props`, the code with a copy button, the install plate, how it works, the props table, and previous/next rooms.
- `/sheet/[slug]` shows one exhibit at every size in light and dark and in a 320px column. It is for review and is not linked.
- The landing page shows six highlights and links to the full collection with the real count. The hero frames, the highlights, the "curate your own wing" preview and the visitors' book all use real exhibits now.
- `/docs` is built from the registry too.

## Checks done

- Build and type checks pass. 215 tests pass (every exhibit rendered with no props and with its example props, plus the logic).
- Every exhibit fits a 288px-wide column (a 320px screen with 16px gutters). The landing page, the gallery and the rooms do not scroll sideways at 320px.
- With reduced motion switched on, the gallery was checked by eye: every exhibit shows its finished state (board text, plaque numbers, counter, timeline, signature).
- Not done: a screen reader pass, and real-device testing on Safari and Firefox. Screenshots were taken in Edge (Chromium) only.

## Skipped or cut

- Nothing from the list of 21 is skipped now. 007, 014 and 018 were left out of the first pass and built in a second one on 16 Nov, at the owner's request.
- **Drag to reorder** on the Tech Stack Shelf (marked optional in the brief).
- **`since` on the Status Card** (week counter) was dropped; `note` covers it.
- **The `variant="bare"` prop** of the old widgets is gone. Exhibits are objects, not cards with an optional frame.
- **A site-wide dark switch.** The exhibits and their rooms have dark.
- **Commits:** each exhibit has its own commit. The Ship Log commit went in with one wrong test expectation, fixed in the commit after it.

## Things the owner should know

- **The package is not published.** `npm i bragkit` on the site will not work for strangers until the first publish.
- **Nothing was pushed.** All work is in local commits on `main`.
- **The demo song is "Baby" by Justin Bieber as text only**, as the brief asked.
- A dev server from another session was running on port 3000 during this work, so `scripts/dev-alt.mjs` (port 3100, its own build folder) was added to run a second one.

## Reserve collection (ideas for later)

- Discord presence through the public Lanyard API (keyless).
- Live Spotify for Now Playing: needs a secret, so it is a server adapter, not a browser feature.
- Weather window (a sibling of Local Time), "on repeat" record crate, career timeline, coffee counter, uses page.
- A bundled single-stroke script font for the Signature, so it looks the same everywhere.
- More logos for the Tech Stack Shelf, and logos loaded one by one so the built-in set costs less.
- Drag to reorder on the Tech Stack Shelf.
- A site-wide dark switch.
