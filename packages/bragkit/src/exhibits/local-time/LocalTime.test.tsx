import { describe, expect, it } from "vitest";
import { describeExhibit, html } from "../../internal/testing";
import { LocalTime } from "./LocalTime";
import { meta as exhibit } from "./meta";
import { skyAt } from "./sky";

describeExhibit(LocalTime, exhibit, import.meta.url, ["Local time", "Lisbon"]);

describe("LocalTime", () => {
  it("renders an empty window of the same size on the server", () => {
    const out = html(LocalTime, { zone: "Europe/Lisbon" });
    expect(out).toContain("--:--");
    expect(out).not.toContain("bk-lt-orb");
  });

  it("draws a fixed moment straight away", () => {
    const out = html(LocalTime, { zone: "Europe/Lisbon", at: "2026-01-15T02:14:00Z" });
    expect(out).toContain("02:14");
    expect(out).toContain("AM");
    expect(out).toContain('data-kind="moon"');
    expect(out).toContain("Lisbon · asleep, probably");
  });

  it("can show a 24-hour clock", () => {
    const out = html(LocalTime, { zone: "Europe/Lisbon", at: "2026-01-15T14:05:00Z", format: "24h" });
    expect(out).toContain("14:05");
    expect(out).not.toContain("bk-lt-period");
  });
});

describe("skyAt", () => {
  it("puts the sun up by day and the moon up by night", () => {
    expect(skyAt(12 * 60).orb.kind).toBe("sun");
    expect(skyAt(2 * 60).orb.kind).toBe("moon");
    expect(skyAt(23 * 60).orb.kind).toBe("moon");
  });

  it("lifts the sun highest around the middle of the day", () => {
    expect(skyAt(765).orb.y).toBeLessThan(skyAt(8 * 60).orb.y);
    expect(skyAt(765).orb.y).toBeLessThan(skyAt(18 * 60).orb.y);
  });

  it("shows stars only when it is dark", () => {
    expect(skyAt(0).stars).toBe(1);
    expect(skyAt(12 * 60).stars).toBe(0);
    expect(skyAt(20 * 60).stars).toBeGreaterThan(0);
  });

  it("wraps around midnight and never leaves the window", () => {
    expect(skyAt(1440)).toEqual(skyAt(0));
    for (let m = 0; m < 1440; m += 30) {
      const { orb } = skyAt(m);
      expect(orb.x).toBeGreaterThanOrEqual(10);
      expect(orb.x).toBeLessThanOrEqual(90);
      expect(orb.y).toBeGreaterThanOrEqual(18);
      expect(orb.y).toBeLessThanOrEqual(76);
    }
  });
});
