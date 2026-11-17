import { describe, expect, it } from "vitest";
import { describeExhibit, html } from "../../internal/testing";
import { ShipLog, logDate } from "./ShipLog";
import { meta as exhibit } from "./meta";

describeExhibit(ShipLog, exhibit, import.meta.url, ["Dark mode, finally", "9 Nov 2026", "Only took three tries."]);

describe("ShipLog", () => {
  it("says so when the log is empty", () => {
    expect(html(ShipLog)).toContain("Nothing in the log yet.");
  });

  it("links the entries that have an href, and only those", () => {
    const out = html(ShipLog, exhibit.example);
    expect(out.match(/<a /g)).toHaveLength(1);
    expect(out).toMatch(/datetime="2026-11-09"/i);
    expect(out).toContain('data-phase="static"');
  });
});

describe("logDate", () => {
  it("formats ISO days and leaves other text alone", () => {
    expect(logDate("2026-11-02")).toBe("2 Nov 2026");
    expect(logDate("Spring 2025")).toBe("Spring 2025");
  });
});
