import { toneProp, type ExhibitMeta } from "../../internal/meta";

export const meta: ExhibitMeta = {
  number: "015",
  slug: "calling-cards",
  name: "Calling Cards",
  component: "CallingCards",
  wing: "North",
  summary: "Where to find you, as a fan of cards.",
  object: "A fan of paper calling cards, held at the bottom.",
  moment: "The fan opens when you hover it, and the card under the pointer rises out of the hand.",
  how: "Each link is a real anchor, so it works with a keyboard and with no script: focus opens the fan too. The cards carry words, not logos. It is plain HTML and CSS and renders on the server.",
  props: {
    links: { type: "json", shape: "{ label: string; handle: string; href: string }[]", description: "One card per link. Three to five fan best." },
    caption: { type: "string", default: "Calling cards", description: "Small label under the cards." },
    tone: toneProp("plain", "the stripe on each card"),
  },
  example: {
    links: [
      { label: "GitHub", handle: "@ada", href: "https://github.com" },
      { label: "Email", handle: "ada@example.com", href: "mailto:ada@example.com" },
      { label: "Mastodon", handle: "@ada@hachyderm.io", href: "https://hachyderm.io" },
      { label: "Website", handle: "ada.example.com", href: "https://example.com" },
    ],
    tone: "cobalt",
  },
  live: false,
  client: false,
};
