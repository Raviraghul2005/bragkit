import { describe, expect, it } from "vitest";
import { describeExhibit, html } from "../../internal/testing";
import { StatsPlaque } from "./StatsPlaque";
import { countAt, parseStat } from "./count";
import { meta as exhibit } from "./meta";

describeExhibit(StatsPlaque, exhibit, import.meta.url, ["By the numbers", "Commits", "4812", "1.2k", "99.9%"]);

describe("StatsPlaque", () => {
  it("renders the finished numbers on the server", () => {
    const out = html(StatsPlaque, { stats: [{ label: "Stars", value: "1.2k" }] });
    expect(out).toContain('data-phase="static"');
    expect(out.match(/>1\.2k</g)).toHaveLength(3);
  });
});

describe("parseStat and countAt", () => {
  it("counts the number and keeps the rest", () => {
    expect(countAt(parseStat("1.2k"), 0.5)).toBe("0.6k");
    expect(countAt(parseStat("99.9%"), 0)).toBe("0.0%");
    expect(countAt(parseStat("$40"), 0.5)).toBe("$20");
    expect(countAt(parseStat(4812), 1)).toBe("4812");
    expect(countAt(parseStat(4812), 0.5)).toBe("2406");
  });

  it("keeps thousands separators", () => {
    expect(countAt(parseStat("12,400"), 1)).toBe("12,400");
    expect(countAt(parseStat("12,400"), 0.5)).toBe("6,200");
    expect(countAt(parseStat(48120), 1)).toBe("48,120");
  });

  it("leaves text with no number alone", () => {
    expect(countAt(parseStat("Lots"), 0.3)).toBe("Lots");
  });
});
