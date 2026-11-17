# Bragkit plan

`COLLECTION.md` is the brief for the collection. `COLLECTION-LOG.md` is the running record: decisions, scores, sizes and what was cut. Start a session with: "Read CLAUDE.md, PLAN.md and COLLECTION-LOG.md, then do the next item."

## Where things stand

Done:

- The foundation: `--bk-` tokens, one stylesheet, `size` / `tone` / `theme` on every exhibit, seven primitives, the registry, subpath exports, render tests.
- All 21 exhibits (see the table below).
- The site: landing page with six highlights, the gallery wall at `/exhibits`, a room per exhibit at `/exhibits/[slug]`, docs at `/docs`, a contact sheet per exhibit at `/sheet/[slug]` (not linked; for visual review).

## Next, in order

1. **First npm publish.** Check the name is still free, then `npm publish` from `packages/bragkit` (the `prepublishOnly` script runs the checks). Until then the install line on the site does not work for strangers.
2. **A site-wide dark switch.** The exhibits and their rooms have dark; the landing page has dark tokens but no switch.
3. **Server adapters** for live data that needs a secret (Spotify for Now Playing, analytics for Head Count). Examples, not package code.
4. **Clean out old CSS** in `apps/web/app/globals.css` left from the first five widgets (`.floor-*`, `.np-*`, `.deck`, `.mini`, `.soon`).

## The collection

| No. | Exhibit | Wing | Component | Client or server |
|---|---|---|---|---|
| 001 | Now Playing | East | `NowPlaying` | server |
| 002 | Shipping Streak | East | `ShippingStreak` | client |
| 003 | Local Time | East | `LocalTime` | client |
| 004 | Status Card | East | `StatusCard` | client |
| 005 | Tech Stack Shelf | West | `TechStack`, `TechShelf` | server |
| 006 | Open For Work | East | `OpenForWork` | client |
| 007 | Currently Reading | East | `CurrentlyReading` | server |
| 008 | Coding Today | East | `CodingToday` | server |
| 009 | Contribution Tapestry | West | `ContributionTapestry` | server |
| 010 | Trophy Case | West | `TrophyCase` | client |
| 011 | Ship Log | West | `ShipLog` | client |
| 012 | Stats Plaque | West | `StatsPlaque` | client |
| 013 | Pinned Repo | West | `PinnedRepo` | client |
| 014 | Polaroid Stack | West | `PolaroidStack` | client |
| 015 | Calling Cards | North | `CallingCards` | server |
| 016 | Signature | North | `Signature` | client |
| 017 | Postcard | North | `Postcard` | client |
| 018 | Desk Setup | North | `DeskSetup` | server |
| 019 | Visitors' Book | South | `VisitorsBook` | client |
| 020 | Head Count | South | `HeadCount` | client |
| 021 | Days Since | South | `DaysSince` | client |

## Promises the site makes

Each one must stay true, or the line gets removed.

- React 18 and 19 supported (peer dependencies; tested on 19).
- Works in Next.js, Vite and Astro.
- Typed props with autocomplete.
- You only ship the exhibits you import (one entry per exhibit; split output).
- Restyle everything with CSS variables (`--bk-*`).
- Dark theme included (exhibits; the landing page has no switch yet).
- Keyboard friendly, calm with reduced motion.
- MIT licence, no account needed.
- Installs with npm, pnpm, yarn and bun. **Not true until the first publish.**

## Demo data

Everything shown on the site is each exhibit's `example` in its `meta.ts`: invented, plausible, and not presented as the maintainer's. The only real numbers on the site are the star count in the nav (from the GitHub API) and the clock in Local Time.

## Open items

- Check that the npm name, the domain and the X handle for "bragkit" are still free before the first publish.
- The Signature uses a script face from the visitor's device, so it looks a little different on Windows, macOS and Android. A bundled path font would fix that.
- Glint has no head-only logo yet; the full bird is used as the icon.