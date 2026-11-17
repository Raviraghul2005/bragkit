import { toneProp, type ExhibitMeta } from "../../internal/meta";

export const meta: ExhibitMeta = {
  number: "019",
  slug: "visitors-book",
  name: "Visitors' Book",
  component: "VisitorsBook",
  wing: "South",
  summary: "Let people sign your portfolio.",
  object: "An open guest book with ruled pages and a ribbon.",
  moment: "A new signature writes itself onto the first line, and the pages turn with a leaf that swings across the spine.",
  how: "You pass the signatures, newest first, three to a page. Bragkit does not store anything: give it onSign and it shows a small form and hands you each new entry to save where you like (a database, a GitHub issue, a file). Without onSign the book is read-only. An empty book says so.",
  props: {
    entries: { type: "json", shape: "{ name: string; note?: string; date?: string }[]", description: "The signatures, newest first. Dates like 2026-11-02 are shown as 2 Nov 2026." },
    onSign: { type: "function", shape: "(entry: { name: string; note: string }) => void | Promise<void>", description: "Called when a visitor signs. Shows the form. Save the entry yourself." },
    caption: { type: "string", default: "Visitors' book", description: "Small heading." },
    tone: toneProp("rose", "the cover and the ribbon"),
  },
  example: {
    entries: [
      { name: "Mina", note: "Came for the record. Stayed for the bird.", date: "2026-11-12" },
      { name: "Tomás R.", note: "Flipped the sign. Twice.", date: "2026-11-09" },
      { name: "Priya", note: "It did not crash once.", date: "2026-11-03" },
      { name: "Jun", note: "Followed a link here.", date: "2026-10-28" },
      { name: "A. Okafor", note: "Checked the numbers. They hold.", date: "2026-10-21" },
      { name: "Ingrid", note: "Hello, world.", date: "2026-10-14" },
      { name: "Sam", note: "Two desks over. Hi.", date: "2026-10-02" },
      { name: "Your mum", note: "Very proud.", date: "2026-09-23" },
    ],
  },
  live: false,
  client: true,
};
