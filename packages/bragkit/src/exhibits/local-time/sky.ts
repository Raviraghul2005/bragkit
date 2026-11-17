// The sky behind the window, from the minute of the day. An approximation: it follows the
// clock, not the real sunrise for a latitude and season.

type Rgb = [number, number, number];
type Stop = [minute: number, top: Rgb, bottom: Rgb];

const STOPS: Stop[] = [
  [0, [7, 11, 36], [27, 35, 80]],
  [300, [16, 20, 62], [60, 52, 110]],
  [390, [86, 108, 190], [255, 182, 140]],
  [480, [86, 164, 240], [207, 230, 255]],
  [720, [58, 140, 238], [190, 224, 255]],
  [1020, [78, 142, 230], [255, 226, 184]],
  [1140, [84, 80, 158], [255, 154, 107]],
  [1230, [32, 39, 94], [106, 74, 134]],
  [1320, [7, 11, 36], [27, 35, 80]],
  [1440, [7, 11, 36], [27, 35, 80]],
];

const SUNRISE = 360;
const SUNSET = 1170;

const mix = (a: Rgb, b: Rgb, t: number): Rgb => [0, 1, 2].map((i) => Math.round(a[i] + (b[i] - a[i]) * t)) as Rgb;
const css = (c: Rgb) => `rgb(${c[0]}, ${c[1]}, ${c[2]})`;

export interface Sky {
  /** CSS colours for the top and bottom of the sky. */
  top: string;
  bottom: string;
  /** The sun or moon, as percentages of the window. */
  orb: { kind: "sun" | "moon"; x: number; y: number };
  /** How visible the stars are, 0 to 1. */
  stars: number;
}

export function skyAt(minuteOfDay: number): Sky {
  const m = ((Math.round(minuteOfDay) % 1440) + 1440) % 1440;
  let i = 0;
  while (i < STOPS.length - 2 && m >= STOPS[i + 1][0]) i += 1;
  const [from, top0, bottom0] = STOPS[i];
  const [to, top1, bottom1] = STOPS[i + 1];
  const t = (m - from) / (to - from);

  const day = m >= SUNRISE && m < SUNSET;
  // How far along its arc the sun (by day) or the moon (by night) is, 0 to 1.
  const along = day ? (m - SUNRISE) / (SUNSET - SUNRISE) : ((m - SUNSET + 1440) % 1440) / (1440 - SUNSET + SUNRISE);
  const stars = m < 300 || m >= 1290 ? 1 : m < 390 ? 1 - (m - 300) / 90 : m >= 1170 ? (m - 1170) / 120 : 0;

  return {
    top: css(mix(top0, top1, t)),
    bottom: css(mix(bottom0, bottom1, t)),
    orb: {
      kind: day ? "sun" : "moon",
      x: Math.round((10 + 80 * along) * 10) / 10,
      y: Math.round((76 - Math.sin(Math.PI * along) * 58) * 10) / 10,
    },
    stars: Math.round(Math.min(1, Math.max(0, stars)) * 100) / 100,
  };
}
