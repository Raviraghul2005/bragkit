import { describe, expect, it } from "vitest";
import { describeExhibit, html } from "../../internal/testing";
import { CodingToday, formatMinutes } from "./CodingToday";
import { meta as exhibit } from "./meta";

describeExhibit(CodingToday, exhibit, import.meta.url, ["TypeScript", "2h 14m", "4h 12m"]);

describe("CodingToday", () => {
  it("gives each chip its language's colour, or the one you chose", () => {
    const out = html(CodingToday, { languages: [{ name: "TypeScript", minutes: 10 }, { name: "Mine", minutes: 5, color: "#ff6b00" }] });
    expect(out).toContain("--bk-c:#3178c6");
    expect(out).toContain("--bk-c:#ff6b00");
    expect(out).toContain("--bk-n:2");
  });

  it("falls back to a colour for a language it does not know", () => {
    expect(html(CodingToday, { languages: [{ name: "Brainfog", minutes: 3 }] })).toContain("--bk-c:#2742d4");
  });
});

describe("formatMinutes", () => {
  it("writes hours and minutes the short way", () => {
    expect(formatMinutes(134)).toBe("2h 14m");
    expect(formatMinutes(45)).toBe("45m");
    expect(formatMinutes(120)).toBe("2h");
    expect(formatMinutes(0)).toBe("0m");
    expect(formatMinutes(Number.NaN)).toBe("0m");
  });
});
