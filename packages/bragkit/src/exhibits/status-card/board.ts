// Laying text out on a split-flap board, and the flicker before each cell settles.

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/** Wraps text into at most `rows` lines of exactly `cols` characters, upper case, padded with spaces. */
export function boardLines(text: string, cols: number, rows: number): string[] {
  const words = text.toUpperCase().replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    let rest = word;
    // A word longer than the board is cut across lines.
    while (rest.length > cols) {
      if (line) {
        lines.push(line);
        line = "";
      }
      lines.push(rest.slice(0, cols));
      rest = rest.slice(cols);
    }
    if (!line) line = rest;
    else if (line.length + 1 + rest.length <= cols) line += ` ${rest}`;
    else {
      lines.push(line);
      line = rest;
    }
  }
  if (line) lines.push(line);
  if (lines.length > rows) {
    lines.length = rows;
    const last = lines[rows - 1];
    lines[rows - 1] = `${last.slice(0, cols - 1).trimEnd()}…`.slice(0, cols);
  }
  while (lines.length < 1) lines.push("");
  return lines.map((l) => l.padEnd(cols, " "));
}

/** The tick at which the cell at `index` shows its real character. Cells settle left to right. */
export function settleTick(index: number): number {
  return 5 + Math.floor(index * 0.55);
}

/** What a cell shows at a tick: a passing glyph until it settles, then its own character. */
export function flapChar(target: string, index: number, tick: number): string {
  if (target === " " || tick >= settleTick(index)) return target;
  return GLYPHS[(index * 7 + tick * 11) % GLYPHS.length];
}
