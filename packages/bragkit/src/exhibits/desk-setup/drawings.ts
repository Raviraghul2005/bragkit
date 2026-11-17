// The desk objects, drawn in a 48 by 48 box with a 1.5 stroke. The desk surface is at y = 45.
// `body` is the part that lights up, `lines` are details, `light` only shows while the object is lit.

export type DeskKind =
  | "monitor"
  | "laptop"
  | "keyboard"
  | "mouse"
  | "mug"
  | "plant"
  | "lamp"
  | "headphones"
  | "notebook"
  | "speaker";

export interface Drawing {
  body: string;
  lines?: string;
  light?: string;
  /** `glow`: the light is a soft filled shape (the lamp). Default: a thin stroke (steam, sound). */
  lightKind?: "glow";
}

export const DRAWINGS: Record<DeskKind, Drawing> = {
  monitor: {
    body: "M8 8h32a2.5 2.5 0 012.5 2.5v19a2.5 2.5 0 01-2.5 2.5H8a2.5 2.5 0 01-2.5-2.5v-19A2.5 2.5 0 018 8z",
    lines: "M24 32v8M16 44.2h16M20 40h8l1.5 4.2h-11z",
  },
  laptop: {
    body: "M11 15h26a2 2 0 012 2v19H9V17a2 2 0 012-2z",
    lines: "M4.5 39h39l-1.6 3.8a2 2 0 01-1.8 1.2H7.9a2 2 0 01-1.8-1.2zM21 41.5h6",
  },
  keyboard: {
    body: "M6 31h36a2.5 2.5 0 012.5 2.5v8a2.5 2.5 0 01-2.5 2.5H6a2.5 2.5 0 01-2.5-2.5v-8A2.5 2.5 0 016 31z",
    lines: "M9 35h2M14.5 35h2M20 35h2M25.5 35h2M31 35h2M36.5 35h2.5M9 39.8h3M15.5 39.8h17M36 39.8h3",
  },
  mouse: {
    body: "M24 28a6.5 6.5 0 016.5 6.5v3a6.5 6.5 0 01-13 0v-3A6.5 6.5 0 0124 28z",
    lines: "M24 28v6",
  },
  mug: {
    body: "M12 23h20v14a7 7 0 01-7 7h-6a7 7 0 01-7-7z",
    lines: "M32 27h2.5a4 4 0 010 8H32",
    light: "M18 18c0-2 2-2 2-4s-2-2-2-4M25 18c0-2 2-2 2-4s-2-2-2-4",
  },
  plant: {
    body: "M24 31c-7.5 0-11.5-4-11.5-10.5C20 20.5 24 24.5 24 31zM24 26.5C24 19.5 28 15.5 34.5 15.5 34.5 22.5 30.5 26.5 24 26.5z",
    lines: "M15.5 34h17l-2 10.2h-13zM24 34V23",
  },
  lamp: {
    body: "M21 7h13l5.5 13H15.5z",
    lines: "M27.5 20v20.5M19.5 44.2h16M21.5 44.2c0-2.2 2.7-3.7 6-3.7s6 1.5 6 3.7",
    light: "M15.5 20h24L46 44H9z",
    lightKind: "glow",
  },
  headphones: {
    body: "M9 28h4a2 2 0 012 2v11a2 2 0 01-2 2H9a3 3 0 01-3-3v-9a3 3 0 013-3zM35 28h4a3 3 0 013 3v9a3 3 0 01-3 3h-4a2 2 0 01-2-2V30a2 2 0 012-2z",
    lines: "M9 28v-3a15 15 0 0130 0v3",
  },
  notebook: {
    body: "M14 9h22a2 2 0 012 2v31a2 2 0 01-2 2H14z",
    lines: "M14 9v35M10.5 16h6M10.5 23h6M10.5 30h6M10.5 37h6M21 18h11M21 23h8",
  },
  speaker: {
    body: "M15 7h18a2.5 2.5 0 012.5 2.5v32a2.5 2.5 0 01-2.5 2.5H15a2.5 2.5 0 01-2.5-2.5v-32A2.5 2.5 0 0115 7z",
    lines: "M24 24.5a7 7 0 100 14 7 7 0 000-14zM24 13a2.5 2.5 0 100 5 2.5 2.5 0 000-5z",
    light: "M40.5 20c2 2.7 2 7.3 0 10M44 17c3.2 4.5 3.2 11.5 0 16",
  },
};

/** Something on the desk bragkit has no drawing for: a plain box. */
export const BOX: Drawing = { body: "M11 22h26a2 2 0 012 2v18a2 2 0 01-2 2H11a2 2 0 01-2-2V24a2 2 0 012-2z", lines: "M9 28h30M21 28v5h6v-5" };
