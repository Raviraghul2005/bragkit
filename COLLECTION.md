# Bragkit — The Collection Build

You are the lead designer and engineer of Bragkit. This is a long, autonomous job. Read this whole prompt before writing any code, then work through it without stopping to ask me questions. When something is unclear, make the most reasonable decision, write it down in `COLLECTION-LOG.md`, and keep going.

Read `CLAUDE.md` and `PLAN.md` first. Everything in them still applies. Where this prompt disagrees with them, this prompt wins, and you update `CLAUDE.md` and `PLAN.md` to match at the end. Also save this prompt as `COLLECTION.md` in the repo root so later sessions can reread it.

---

## 0. What Bragkit is, and why this matters

Bragkit is an open-source React library of **live widgets for developer portfolios**. People install it, import one widget, and their portfolio gets a beautiful, interactive piece that shows off something about them: what they are listening to, how long their streak is, what time it is where they live, what they are building.

Why this has demand: developers already decorate their GitHub profiles with stats cards, streak counters, trophies, visitor counters, "now playing" cards and Discord presence badges. Those tools are popular but they are **images** made for READMEs: flat, static, ugly, and identical on everyone's profile. Nobody has made the **premium, interactive, React-native** version for real portfolio websites. That is the gap. Bragkit is that version.

The bar is **Stick It Up** (stickitupx.vercel.app): a one-person open-source sticker library that feels expensive because every surface feels like a real object. We do not copy it. We match its level of craft with our own idea.

**Our idea: a small gallery.** Your portfolio is a museum and your wins are the exhibits. The page is a quiet white room. Each widget is a prized object: lit from above, standing on its own shadow, labelled like a museum piece ("No. 007 · Live"), and it reacts when you touch it. The mascot is **Glint**, a magpie who collects shiny things.

The goal of this job: grow Bragkit from 5 widgets into a **real collection of 18+ premium exhibits**, plus the `/exhibits` page where people browse, tweak and copy them. This is the product. The landing page only sells it.

---

## 1. Phase 1 — Audit first (do not skip)

Before building anything new:

1. Look at the repo and write a short state report at the top of `COLLECTION-LOG.md`:
   - What exists in `packages/bragkit` (real components, or none?)
   - What the website currently shows, and whether the landing page widgets are **real imported components** or **hardcoded markup** pretending to be widgets
   - Whether the build passes
2. Run the site and look at it in a real browser at 1440, 1024 and 390px wide, in light and dark. Take screenshots (Playwright is fine). Judge it honestly against section 4 (the quality bar).
3. Write down every problem you find. Then fix the important ones as part of this job. You have my permission to redesign anything that is not good enough: the landing page, the existing 5 widgets, the tokens. Do not keep something weak just because it already exists.

---

## 2. Phase 2 — The foundation (build this before any new exhibit)

Every exhibit is built on the same foundation. Get this right first, because 18 widgets will copy it.

### 2.1 Package structure

    packages/bragkit/
      src/
        index.ts                  // named exports for every exhibit and primitive
        styles.css                // ONE stylesheet users import once
        tokens.css                // the design tokens, all prefixed --bk-
        primitives/               // the gallery building blocks (see 2.3)
        exhibits/
          now-playing/
            NowPlaying.tsx
            now-playing.css
            meta.ts               // registry metadata (see 2.4)
            NowPlaying.test.tsx
          local-time/ ...
        registry.ts               // list of every exhibit's meta, for the website

- Build with tsup to ESM + CJS + `.d.ts`. Every exhibit is also available as a subpath export (`bragkit/now-playing`) so people only ship what they import.
- `react` and `react-dom` (18 and 19) are peer dependencies. **No other runtime dependencies.** No animation library, no icon library, no CSS-in-JS. Plain CSS + small amounts of JS.
- Keep each exhibit small. Target under 4 KB gzipped of JS per exhibit, excluding React. Note real sizes in the log.

### 2.2 Styling rules for a library (fix these if the current setup breaks them)

- **Prefix everything.** Token variables are `--bk-*` (for example `--bk-ink`, `--bk-wall`). Class names are `bk-*`. A library must never collide with the user's own `--ink` or `.card`. If the current package uses unprefixed names, change them.
- Users theme Bragkit by overriding variables, either globally or on one exhibit: `<NowPlaying style={{ "--bk-accent": "#ff6b00" }} />` must work.
- Every exhibit takes `className` and `style` and passes them to its root element.
- Dark mode: support `[data-theme="dark"]` on any ancestor **and** a `theme="light" | "dark" | "auto"` prop. `auto` follows `prefers-color-scheme`.
- Every exhibit has a `size` prop: `"sm" | "md" | "lg"`, default `"md"`. Sizes scale with CSS variables, not separate markup.
- Every exhibit has a `tone` prop where colour makes sense: `"apricot" | "lilac" | "mint" | "rose" | "cobalt" | "plain"`.

### 2.3 Primitives (export these too)

These let people build their own exhibits in the Bragkit style, which makes the library feel bigger and invites contributions:

| Primitive | What it is |
|---|---|
| `<Case tone>` | The candy gradient card with tinted shadow and top light |
| `<Placard number title medium note>` | The museum label: mono number, italic serif title, small caption |
| `<Plinth>` | Wraps any child so it stands on a soft contact shadow and lifts on hover |
| `<Hang drop sway>` | Hangs any child from a wire with a brass nail, swaying gently |
| `<BrassPlate copy>` | The engraved brass button that copies text, with screws and a shine sweep |
| `<Medal>` | The small brass count chip (stars, numbers) |
| `<LiveDot>` | The breathing green dot. Only for genuinely live data |

### 2.4 The registry

Each exhibit has a `meta.ts`:

    export const meta = {
      number: "007",
      slug: "visitors-book",
      name: "Visitors' Book",
      wing: "South",                  // see section 5
      summary: "Let people sign your portfolio.",
      props: { /* small schema: name, type, default, options, description */ },
      example: { /* the props used in the default demo */ },
      live: false,                    // true only if it can read real live data
    }

The website reads the registry to build `/exhibits` automatically. Adding an exhibit to the registry is all it should take to show it on the site.

### 2.5 Data rules (important)

- **Static first.** Every exhibit works fully from props with no network calls and no API keys. This is v1.
- **Live is optional, later, and never with secrets in the browser.** Where an exhibit can be live (GitHub, Discord presence), design the props so data can be passed in, and add a tiny optional helper for fetching **only from public, keyless APIs**. Anything that needs a secret key is a later server-side "adapter", not part of this job. Write those ideas in the log instead.
- Never fake liveness. The `LiveDot` and the word "Live" appear only when data is actually live.
- Demo data on the website is invented but plausible, and the page must not pretend it is the maintainer's real data. Now Playing demo is "Baby" by Justin Bieber, with **no album art** (use our own abstract cover and the spinning record).

### 2.6 Non-negotiables for every exhibit

- Server-render safe. No hydration mismatch. Anything time-based (clocks, "x days ago") renders a stable placeholder on the server and fills in after mount, or uses `suppressHydrationWarning` correctly.
- No layout shift. Fixed or reserved size while loading.
- `"use client"` only on exhibits that actually need interaction or timers.
- Keyboard reachable, visible focus ring, real `<button>` / `<a>`, `aria-label` where text is missing, contrast 4.5:1 for text.
- `prefers-reduced-motion`: no swaying, spinning, flipping or drifting. State changes become instant.
- Works at 320px wide.
- A test file covering: renders with no props, renders with example props, respects reduced motion where relevant.

---

## 3. Phase 3 — The design language for exhibits

Read the gallery rules in `CLAUDE.md`. On top of them, every new exhibit must follow these:

1. **One physical metaphor.** Each exhibit is a real-world object: a split-flap board, a turnstile counter, a book on a shelf, an enamel pin, a postcard, a door sign. Pick the object first, then design. If you cannot name the object, the design is not ready.
2. **One signature moment.** Each exhibit has exactly one delightful interaction that makes people screenshot it: a flap that flips, a card that tilts toward the pointer, a signature that draws itself, a pin you can wiggle. One, done perfectly. Not five.
3. **Lit from above, standing on a shadow.** 1px light top edge, layered soft shadows, contact shadow under objects. Colour of the shadow matches what the object sits on.
4. **Museum labelling.** Small mono uppercase labels, italic serif for anything that is a "title of a work", dry copy.
5. **Quiet until touched.** Ambient motion only where it explains the object (a record spins, a frame sways). Everything else waits for hover, focus or click.
6. **Springy, physical motion.** Use the `--bk-ease-lift` spring for hover and press, `--bk-ease-settle` for arrivals. Nothing linear except continuous rotation.
7. **Restraint with colour.** One tone per exhibit. Brass only for plates, medals, nails and trophies.

**Things that make it look cheap (never do these):** emoji as icons, generic gradient blobs, glassmorphism everywhere, neon glows, thick borders, bold headlines, more than one accent colour, drop shadows that surround an object instead of falling below it, stock-looking icons, cramped padding, centred-everything layouts, fake testimonials or fake numbers presented as real.

---

## 4. The quality bar (check every exhibit against this)

After building each exhibit, render it in a browser at sm, md and lg, light and dark, and at 390px wide. Screenshot it. Then score it honestly from 1 to 5 on each line. Anything below 4 gets redesigned before you move on, up to two rounds. Record the scores in the log.

| # | Question |
|---|---|
| 1 | Would a designer screenshot this and post it? |
| 2 | Does it read as a real object, not a flat card? |
| 3 | Is the signature moment delightful and smooth at 60 fps? |
| 4 | Does it look as good in dark as in light? |
| 5 | Does it still look intentional at sm size and at 390px? |
| 6 | Is the typography calm (no bold headlines, tight tracking, one italic accent at most)? |
| 7 | Would a developer understand its props in 10 seconds? |
| 8 | Does it fit next to the other exhibits as one family? |

---

## 5. The collection

Group exhibits into **wings** (categories). Numbers run in order. The first five already exist: rebuild them on the new foundation and raise them to the quality bar.

### East Wing — What you are doing (live and current)

| No. | Exhibit | Object | Signature moment | Key props |
|---|---|---|---|---|
| 001 | **Now Playing** | A record sleeve with the vinyl sliding out | Record slides further out and spins faster on hover; equaliser bars move | `track`, `artist`, `progress`, `paused` |
| 002 | **Shipping Streak** | A wall of tiles, one per day | Hovering a tile lifts it and shows the date; today's tile pulses once on load | `days`, `start`, `history` |
| 003 | **Local Time** | A small window with the sky behind it | The sky gradient matches the real time of day where you live; sun or moon moves along an arc | `zone`, `label`, `format` |
| 004 | **Status Card** | Rebuild as a **departures board**: split-flap letters | Letters flip into place on load, like an airport board | `title`, `note`, `progress` |
| 006 | **Open For Work** | A hanging door sign on a string, OPEN on one side, CLOSED on the other | Click flips the sign over with a 3D turn; it swings and settles | `open`, `note`, `href` |
| 007 | **Currently Reading** | A book standing on a shelf, spine out | On hover the book tilts out to show the cover and a ribbon bookmark at the reading progress | `title`, `author`, `progress`, `color` |
| 008 | **Coding Today** | A row of paint chips, one per language | Chips fan out on hover showing language and time | `languages: {name, minutes}[]` |

### West Wing — What you have done (proof and history)

| No. | Exhibit | Object | Signature moment | Key props |
|---|---|---|---|---|
| 005 | **Tech Stack Shelf** | Small objects on a shelf | Each item lifts and shows its name on hover; drag to reorder (optional) | `items` |
| 009 | **Contribution Tapestry** | A year of activity woven as a textile | Hover a row and it lifts slightly like fabric; a tooltip shows the day | `data: {date, count}[]`, `weeks` |
| 010 | **Trophy Case** | Enamel pins on a felt board | Each pin tilts toward the pointer (3D) with a metal glint | `pins: {label, icon?, tone}[]` |
| 011 | **Ship Log** | A museum timeline with brass pins | Entries settle in one by one as the timeline enters the screen | `entries: {date, title, href?}[]` |
| 012 | **Stats Plaque** | An engraved brass plaque | Numbers count up when it enters the screen; one shine sweep | `stats: {label, value}[]` |
| 013 | **Pinned Repo** | A small framed exhibit card for a project | Star medal shimmers on hover; frame tilts gently with the pointer | `name`, `description`, `stars`, `language`, `href` |
| 014 | **Polaroid Stack** | A stack of polaroids of your projects | Click to deal the top photo to the back; fan out on hover | `photos: {src, caption, href?}[]` |

### North Wing — Who you are (identity)

| No. | Exhibit | Object | Signature moment | Key props |
|---|---|---|---|---|
| 015 | **Calling Cards** | A fan of business cards, one per social link | Cards fan out on hover; the hovered card rises | `links: {label, handle, href}[]` |
| 016 | **Signature** | A handwritten signature | It draws itself stroke by stroke when it enters the screen | `name` (rendered in a script style) or `path` (custom SVG) |
| 017 | **Postcard** | A postcard you can flip over | Click flips it; the back has a "write to me" line and a stamp | `place`, `message`, `email` |
| 018 | **Desk Setup** | A row of desk objects (keyboard, mug, plant, lamp) drawn simply | Hovering an object lights it and shows what it is | `items: {kind, label, href?}[]` |

### South Wing — Your visitors (community)

| No. | Exhibit | Object | Signature moment | Key props |
|---|---|---|---|---|
| 019 | **Visitors' Book** | An open guest book with signatures | New signature writes itself in; pages turn | `entries: {name, note, date}[]`, `onSign?` |
| 020 | **Head Count** | A mechanical turnstile counter | Digits roll like an odometer when the number changes | `count`, `label` |
| 021 | **Days Since** | A factory-style "days since" sign with flip numbers | Number flips to its value on load; click to "reset" in demo | `days`, `label` |

That is 21 exhibits. If time is short, finish in this order and **ship fewer at full quality rather than more at half quality**: 001–005 rebuilt, then 006, 004 (departures board), 009, 010, 012, 015, 016, 019, 020, then the rest.

You may replace any exhibit above with a better idea if you are confident it is better. Write down why in the log. Ideas for later go in a "Reserve collection" list in the log (for example: Discord presence via the public Lanyard API, weather window, "on repeat" record crate, career timeline, coffee counter, uses page).

---

## 6. Phase 4 — The `/exhibits` page (the real product page)

This is where people choose and copy. It must feel as premium as the landing page.

- **Top:** big calm headline in the house style, a short line, the install brass plate, and a filter row by wing (East, West, North, South, All).
- **The floor:** every exhibit from the registry, shown live, each with its placard (number, name in italic serif, one-line summary). Arrange them like a gallery wall, not a uniform grid: varied sizes, generous space, objects on shelves and plinths.
- **Clicking an exhibit** opens its own page `/exhibits/[slug]` with:
  - a large live preview on a plinth, with light/dark and sm/md/lg toggles
  - a props panel built from `meta.props` (text inputs, sliders, toggles, tone swatches); the preview updates live
  - the code for the current props, with a copy button
  - the install line and the import line
  - a short "how it works" and the props table
  - previous and next exhibit, like walking to the next room
- **Glint** appears once on this page in the right pose (for example looking at the filter row).
- Link it from the nav ("Collection") and from every "Browse the collection" button.
- Add a small **"Suggest an exhibit"** card at the end linking to a GitHub issue template. Create that template: `.github/ISSUE_TEMPLATE/suggest-an-exhibit.yml`.

---

## 7. Phase 5 — Update the landing page

- Replace any hardcoded widget markup with real imported exhibits.
- The collection section on the landing page shows a curated **6 highlights**, not all 21, and ends with "See the full collection (21 exhibits)" linking to `/exhibits`.
- Update the numbers and copy to match what really exists. If the page claims something the package does not do, fix the package or remove the claim.
- Keep the hero (hanging frames from the brass rail), the golden ticket and the after-hours footer unless your audit found them weak. If you change them, keep the same spirit.

---

## 8. Process rules for this run

- Work in this order: audit → foundation → rebuild 001–005 → new exhibits in priority order → `/exhibits` page → landing page update → docs.
- **Commit after every finished exhibit** with a clear message ("Add No. 010 Trophy Case").
- Keep `COLLECTION-LOG.md` updated as you go: decisions, scores, sizes, skipped items, reserve ideas. If the run stops halfway, the log is how the next session continues.
- Run `npm run build` and the tests after each exhibit. Never leave the build broken between commits.
- Do not publish to npm. Do not change anything on Vercel except through normal git pushes if the repo is already connected.
- Do not add dependencies without writing the reason in the log. The goal is zero runtime dependencies.
- No third-party logos except inside an exhibit that represents that service, following that service's brand rules. No real album art, no photos of real people, no copied artwork.

---

## 9. When you finish

Update `CLAUDE.md` and `PLAN.md` to reflect the new structure. Then give me a short report in plain, simple words (I find jargon hard to follow):

1. A table of every exhibit: number, name, status (done / partial / skipped), quality score, and where to see it on the site
2. What you changed from the audit and why
3. What is left, in priority order
4. Anything I need to do myself (like checking names, adding keys, or reviewing something visually)
