import { toneProp, type ExhibitMeta } from "../../internal/meta";

export const meta: ExhibitMeta = {
  number: "001",
  slug: "now-playing",
  name: "Now Playing",
  component: "NowPlaying",
  wing: "East",
  summary: "The track you want on display.",
  object: "A record sleeve with the vinyl sliding out.",
  moment: "The record slides further out and spins faster when you hover it.",
  how: "You pass the track and the artist as props, so it works with no account and no keys. The cover is drawn in CSS from the tone, never from album art. Set paused to stop the record.",
  props: {
    track: { type: "string", default: "Untitled", description: "The song title." },
    artist: { type: "string", default: "Unknown artist", description: "Who it is by." },
    progress: { type: "number", default: 0.4, min: 0, max: 1, step: 0.01, description: "How far through the track, 0 to 1." },
    paused: { type: "boolean", default: false, description: "Stops the record and the equaliser." },
    href: { type: "string", placeholder: "https://", description: "Makes the title a link." },
    caption: { type: "string", placeholder: "Now playing", description: "Small heading above the title." },
    tone: toneProp("lilac", "the sleeve"),
  },
  example: { track: "Baby", artist: "Justin Bieber", progress: 0.62 },
  live: false,
  client: false,
};
