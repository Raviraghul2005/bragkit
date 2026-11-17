import { describe, expect, it } from "vitest";
import { describeExhibit, html } from "../../internal/testing";
import { ContributionAlmanac, readout } from "./ContributionAlmanac";
import { buildAlmanac, levelOf, levelThresholds, sampleContributions } from "./almanac";
import { meta as exhibit } from "./meta";

describeExhibit(ContributionAlmanac, exhibit, import.meta.url, ["Contributions", "in the last year", "Longest streak", "Best month"]);

describe("ContributionAlmanac", () => {
  it("renders twelve months with their names from data alone, on the server", () => {
    const out = html(ContributionAlmanac, { data: [{ date: "2026-11-14", count: 3 }] });
    expect(out.match(/class="bk-ca-month"/g)).toHaveLength(12);
    expect(out).toContain(">Dec<");
    expect(out).toContain(">Nov<");
    expect(out).toContain('data-k="2026-11-14"');
  });

  it("shows blank months of the same size while it does not know the date yet", () => {
    const out = html(ContributionAlmanac, { user: "octocat" });
    expect(out.match(/class="bk-ca-month"/g)).toHaveLength(12);
    expect(out).toContain("Loading from GitHub");
    expect(out).not.toContain("bk-live-dot");
    expect(out).toContain('href="https://github.com/octocat"');
  });

  it("is honest when there is nothing yet", () => {
    expect(html(ContributionAlmanac, { end: "2026-11-14" })).toContain("No contributions yet");
  });
});

describe("buildAlmanac", () => {
  it("lays out the twelve months ending with the month of the last day", () => {
    const a = buildAlmanac([{ date: "2026-08-04", count: 9 }], "2026-11-14")!;
    expect(a.months.map((m) => m.short).join(" ")).toBe("Dec Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov");
    expect(a.months[0].long).toBe("December 2025");
    // 1 Aug 2026 is a Saturday.
    expect(a.months[8].offset).toBe(6);
    expect(a.months[8].total).toBe(9);
    expect(a.months[11].days.filter((d) => d.future)).toHaveLength(16);
  });

  it("counts streaks, the busiest day and the best month", () => {
    const a = buildAlmanac(
      [
        { date: "2026-10-01", count: 2 },
        { date: "2026-10-02", count: 2 },
        { date: "2026-10-03", count: 20 },
        { date: "2026-11-13", count: 1 },
        { date: "2026-11-14", count: 1 },
      ],
      "2026-11-14",
    )!;
    expect(a.total).toBe(26);
    expect(a.longestStreak).toBe(3);
    expect(a.currentStreak).toBe(2);
    expect(a.busiestDay?.key).toBe("2026-10-03");
    expect(a.bestMonth?.short).toBe("Oct");
    expect(a.activeDays).toBe(5);
  });

  it("keeps a streak that ended yesterday, and drops days it cannot read", () => {
    const a = buildAlmanac([{ date: "2026-11-13", count: 1 }, { date: "nope", count: 4 }], "2026-11-14")!;
    expect(a.currentStreak).toBe(1);
    expect(a.total).toBe(1);
  });

  it("returns nothing when it has no day to end on", () => {
    expect(buildAlmanac([], undefined)).toBeNull();
  });
});

describe("levels", () => {
  it("splits the busy days into quarters, like GitHub", () => {
    const t = levelThresholds([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(levelOf(0, t)).toBe(0);
    expect(levelOf(1, t)).toBe(1);
    expect(levelOf(8, t)).toBe(4);
    expect(new Set([1, 2, 3, 4, 5, 6, 7, 8].map((n) => levelOf(n, t))).size).toBe(4);
  });
});

describe("readout", () => {
  const a = buildAlmanac(sampleContributions("2026-11-14"), "2026-11-14");

  it("says something useful before you point at anything", () => {
    expect(readout(null, a, "contributions")).toMatch(/^Busiest on \w+days · active on \d+ days$/);
  });

  it("names the day or the month you point at", () => {
    const aug = a!.months[8];
    expect(readout({ kind: "month", month: aug }, a, "contributions")).toMatch(/^August 2026 · [\d,]+ contributions? on \d+ days?$/);
    const day = { key: "2026-08-04", date: 4, weekday: 2, count: 1, level: 1, future: false };
    expect(readout({ kind: "day", day }, a, "contributions")).toBe("Tue, 4 Aug 2026 · 1 contribution");
  });
});
