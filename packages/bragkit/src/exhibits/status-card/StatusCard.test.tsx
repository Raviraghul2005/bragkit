import { describe, expect, it } from "vitest";
import { describeExhibit, html } from "../../internal/testing";
import { StatusCard } from "./StatusCard";
import { boardLines, flapChar, settleTick } from "./board";
import { meta as exhibit } from "./meta";

describeExhibit(StatusCard, exhibit, import.meta.url, ["A CLI that names your variables", "Week 3 · on time", "62%"]);

describe("StatusCard", () => {
  it("renders the finished board on the server", () => {
    const out = html(StatusCard, { title: "Ship it", columns: 8, rows: 1 });
    expect(out.match(/class="bk-flap"/g)).toHaveLength(8);
    expect(out).toContain(">S<");
  });

  it("leaves out the bar when there is no progress", () => {
    expect(html(StatusCard, { title: "Ship it" })).not.toContain("progressbar");
    expect(html(StatusCard, { title: "Ship it", progress: 140 })).toContain('aria-valuenow="100"');
  });
});

describe("boardLines", () => {
  it("wraps words and pads every line to the board width", () => {
    expect(boardLines("A CLI that names your variables", 12, 3)).toEqual([
      "A CLI THAT  ",
      "NAMES YOUR  ",
      "VARIABLES   ",
    ]);
  });

  it("cuts a title that does not fit", () => {
    const lines = boardLines("one two three four five six seven", 8, 2);
    expect(lines).toHaveLength(2);
    expect(lines[1].trimEnd().endsWith("…")).toBe(true);
    expect(lines.every((l) => l.length === 8)).toBe(true);
  });

  it("breaks a word longer than the board", () => {
    expect(boardLines("supercalifragilistic", 8, 3)).toEqual(["SUPERCAL", "IFRAGILI", "STIC    "]);
  });

  it("always has one line", () => {
    expect(boardLines("", 6, 2)).toEqual(["      "]);
  });
});

describe("flapChar", () => {
  it("settles left to right and never flips a blank", () => {
    expect(flapChar("A", 0, settleTick(0))).toBe("A");
    expect(flapChar("A", 10, 0)).not.toBe("A");
    expect(flapChar(" ", 3, 0)).toBe(" ");
    expect(settleTick(20)).toBeGreaterThan(settleTick(2));
  });
});
