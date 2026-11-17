import { describe, expect, it } from "vitest";
import { describeExhibit, html } from "../../internal/testing";
import { ContributionTapestry } from "./ContributionTapestry";
import { meta as exhibit } from "./meta";
import { sampleContributions, weave } from "./weave";

describeExhibit(ContributionTapestry, exhibit, import.meta.url, ["Contributions", "in 26 weeks"]);

describe("ContributionTapestry", () => {
  it("is honest when there is nothing to weave", () => {
    const out = html(ContributionTapestry);
    expect(out).toContain("No contributions yet");
    expect(out).not.toContain("data-tip");
  });

  it("names the day and the count on each stitch", () => {
    const out = html(ContributionTapestry, { data: [{ date: "2026-11-13", count: 1 }, { date: "2026-11-14", count: 5 }], weeks: 8 });
    expect(out).toContain("1 contribution · Fri 13 Nov");
    expect(out).toContain("5 contributions · Sat 14 Nov");
  });
});

describe("weave", () => {
  it("makes seven rows of one stitch per week, ending on the last day", () => {
    const { rows, total } = weave([{ date: "2026-11-11", count: 3 }], 4);
    expect(rows).toHaveLength(7);
    expect(rows.every((r) => r.length === 4)).toBe(true);
    // 11 Nov 2026 is a Wednesday: row 3, last column. The days after it are not on the cloth yet.
    expect(rows[3][3]).toEqual({ day: "2026-11-11", count: 3, level: 4 });
    expect(rows[4][3].day).toBeNull();
    expect(rows[0][0].day).toBe("2026-10-18");
    expect(total).toBe(3);
  });

  it("grades each day against the busiest one, and adds up days listed twice", () => {
    const { rows } = weave(
      [
        { date: "2026-11-09", count: 1 },
        { date: "2026-11-10", count: 4 },
        { date: "2026-11-10", count: 4 },
        { date: "2026-11-11", count: 0 },
      ],
      1,
      "2026-11-14",
    );
    expect(rows[1][0].level).toBe(1);
    expect(rows[2][0]).toMatchObject({ count: 8, level: 4 });
    expect(rows[3][0].level).toBe(0);
  });

  it("ignores days it cannot read", () => {
    expect(weave([{ date: "not a day", count: 2 }], 2).total).toBe(0);
  });
});

describe("sampleContributions", () => {
  it("is the same every time", () => {
    expect(sampleContributions("2026-11-14", 4)).toEqual(sampleContributions("2026-11-14", 4));
    expect(sampleContributions("2026-11-14", 26).length).toBeGreaterThan(60);
  });
});
