import { describe, expect, it } from "vitest";
import { describeExhibit, html } from "../../internal/testing";
import { DaysSince, flipDigits } from "./DaysSince";
import { meta as exhibit } from "./meta";

describeExhibit(DaysSince, exhibit, import.meta.url, ["47 days", "rewriting it in a new framework", "Reset"]);

describe("DaysSince", () => {
  it("shows a given number straight away, with two flaps at least", () => {
    const out = html(DaysSince, { days: 7 });
    expect(out).toContain('aria-label="7 days"');
    expect(out.match(/class="bk-flap"/g)).toHaveLength(2);
    expect(html(DaysSince, { days: 1 })).toContain('aria-label="1 day"');
  });

  it("shows dashes on the server when it has to count from a date", () => {
    const out = html(DaysSince, { since: "2026-09-29" });
    expect(out).toContain("Counting the days");
    expect(out).toContain("–");
  });

  it("has no reset button unless asked", () => {
    expect(html(DaysSince, { days: 3 })).not.toContain("<button");
    expect(html(DaysSince, { days: 3, resettable: true })).toContain("<button");
  });
});

describe("flipDigits", () => {
  it("counts each digit up into place, left to right", () => {
    expect(flipDigits("47", 0)).toBe("90");
    expect(flipDigits("47", 5)).toBe("45");
    expect(flipDigits("47", 7)).toBe("47");
    expect(flipDigits("––", 0)).toBe("––");
  });
});
