<p align="center">
  <img src="https://raw.githubusercontent.com/Raviraghul2005/bragkit/main/design/assets/glint-pearl.svg" width="140" height="140" alt="Glint, the Bragkit magpie, holding a brass pearl">
</p>

<h1 align="center">bragkit</h1>

<p align="center">
  Exhibits for your portfolio. Show off, tastefully.<br>
  <a href="https://bragkit.vercel.app">Website</a> ·
  <a href="https://bragkit.vercel.app/exhibits">The collection</a> ·
  <a href="https://bragkit.vercel.app/docs">Docs</a>
</p>

Bragkit is a kit of React components for portfolio sites. Each one is a small object that shows something about you: a record sleeve for what you are playing, a departures board for what you are building, a guest book people can sign. Each is lit from above, stands on its own shadow and does one thing when you touch it. One import each, no account, no keys, MIT licence.

## Install

```bash
npm i bragkit
```

pnpm, yarn and bun also know the way. Bragkit needs React 18 or 19 and has no other dependencies.

## Use

Import the stylesheet once, anywhere (your root layout is a good place). Then hang an exhibit.

```tsx
import "bragkit/styles.css"
import { NowPlaying, StatusCard } from "bragkit"

<NowPlaying track="Baby" artist="Justin Bieber" progress={0.62} />
<StatusCard title="A CLI that names your variables" note="Week 3 · on time" progress={62} />
```

Every exhibit works from props alone and renders on the server. Bragkit loads no fonts: it looks best with Geist, Geist Mono and Instrument Serif, and falls back to system fonts.

To ship only one exhibit, import it by name: `import { NowPlaying } from "bragkit/now-playing"`. Its styles are at `bragkit/css/now-playing.css`, with the shared part in `bragkit/css/base.css`.

## The collection

| No. | Exhibit | Component | What it is |
|---|---|---|---|
| 001 | Now Playing | `NowPlaying` | A record sleeve with the vinyl sliding out |
| 002 | Shipping Streak | `ShippingStreak` | A wall of glazed tiles, one per day |
| 003 | Local Time | `LocalTime` | An arched window with the sky of the hour behind it |
| 004 | Status Card | `StatusCard` | A split-flap departures board |
| 005 | Tech Stack Keyboard | `TechStack` | A keyboard where every key is a tool, with its logo |
| 006 | Open For Work | `OpenForWork` | A door sign that turns over |
| 007 | Currently Reading | `CurrentlyReading` | A book that tilts out of the shelf to show its cover |
| 008 | Coding Today | `CodingToday` | A fan deck of paint chips, one per language |
| 009 | Contribution Tapestry | `ContributionTapestry` | Half a year of activity, woven |
| 010 | Trophy Case | `TrophyCase` | Enamel pins on felt that tilt toward the pointer |
| 011 | Ship Log | `ShipLog` | A timeline with brass pins |
| 012 | Stats Plaque | `StatsPlaque` | An engraved brass plaque that counts up |
| 013 | Pinned Repo | `PinnedRepo` | A project card in a frame |
| 014 | Polaroid Stack | `PolaroidStack` | A pile of polaroids you can deal |
| 015 | Calling Cards | `CallingCards` | A fan of cards, one per link |
| 016 | Signature | `Signature` | A slip of paper that signs itself |
| 017 | Postcard | `Postcard` | A postcard that turns over |
| 018 | Desk Setup | `DeskSetup` | Desk objects that light up when touched |
| 019 | Visitors' Book | `VisitorsBook` | An open guest book people can sign |
| 020 | Head Count | `HeadCount` | A mechanical counter with rolling wheels |
| 021 | Days Since | `DaysSince` | A factory sign with flip numbers |

Try each one, change its props and copy the code at [bragkit.vercel.app/exhibits](https://bragkit.vercel.app/exhibits).

## Shared props

Every exhibit takes:

| Prop | Type | Notes |
|---|---|---|
| `size` | `"sm" \| "md" \| "lg"` | Default `md`. Set `--bk-scale` in CSS for anything in between. |
| `theme` | `"light" \| "dark" \| "auto"` | Default: follows the page. `auto` follows the system. |
| `tone` | `"apricot" \| "lilac" \| "mint" \| "rose" \| "cobalt" \| "plain"` | On the exhibits where colour makes sense. |
| `className`, `style`, `id` | | Passed to the outer element. |

## Theming

Every colour, font and curve is a CSS variable with the prefix `--bk-`, and every class starts with `bk-`, so nothing collides with your own styles.

```css
:root {
  --bk-font-sans: "Inter", sans-serif;
  --bk-lilac: #b9a2ff;
}
```

```tsx
<NowPlaying style={{ "--bk-accent": "#ff6b00" }} />
```

Put `data-theme="dark"` on any ancestor for the dark theme, or pass `theme="dark"`. Paper, brass, felt and the candy tones keep their colour in the dark, like lit objects in a dark room. Animations stop for visitors who turn motion off.

## Data

Bragkit does not fetch, track or store anything by default. You pass the data.

- `ShippingStreak` can read a GitHub user's public pushes when you give it `user` (no key).
- `LocalTime` reads the visitor's clock.
- `VisitorsBook` hands each new signature to your `onSign` function. Where you save it is up to you.
- Anything that needs a secret (live Spotify, private analytics) belongs on your server. Pass the result in as props.

## The Tech Stack Keyboard

Every tool is a key with its real logo printed on it. Give it names, or rows of names, and mark your main tools `wide`:

```tsx
<TechStack
  groups={{
    Languages: [{ name: "TypeScript", wide: true, note: "daily" }, "Rust", "Go"],
    Tools: ["Git", "Docker", "Postgres", "Figma"],
  }}
/>
```

About 175 tools have a built-in logo. Anything else gets letters, like a keyboard legend, or your own `icon` or `src`.

The logo data comes from [Simple Icons](https://simpleicons.org) (CC0). The logos are trademarks of their owners and are shown unaltered; a logo too pale for a cream key gets a dark key instead of a new colour. All the built-in logos together are about 92 KB (gzipped). In a server component (the default in the Next.js App Router) that costs the browser nothing. If it runs in the browser, use `TechKeyboard` with only the logos you need:

```tsx
import { TechKeyboard } from "bragkit"
import { react, typescript } from "bragkit/logos"

<TechKeyboard items={[{ ...typescript, wide: true }, react]} />
```

## Building blocks

The parts the exhibits are made of are exported too: `Case`, `Placard`, `Plinth`, `Hang`, `BrassPlate`, `Medal` and `LiveDot`.

```tsx
import { Hang, Case, Placard } from "bragkit"

<Hang drop={80} sway={2}>
  <Case tone="mint">
    <Placard number="022" title="My own exhibit" medium="React, CSS" />
  </Case>
</Hang>
```

## Suggest an exhibit

The collection has room. [Open an issue](https://github.com/Raviraghul2005/bragkit/issues/new?template=suggest-an-exhibit.yml) and name the object and the one thing it does when touched.

## Development

```bash
npm install
```

```bash
npm run dev
```

The repo is an npm workspace: `packages/bragkit` is the package and `apps/web` is the website. `npm run build` builds both, `npm run typecheck` checks both, and `npm test -w bragkit` runs the tests. `COLLECTION.md` is the design brief for exhibits and `COLLECTION-LOG.md` is the running record.

To add an exhibit, create `packages/bragkit/src/exhibits/<slug>/` with the component, its CSS, a `meta.ts` and a test, then add it to `src/index.ts`, `src/registry.ts` and `src/styles.css`. The website builds its page from the registry.

## Licence

MIT. Curated by Ravi Raghul.
