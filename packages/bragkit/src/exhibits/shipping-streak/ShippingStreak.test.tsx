import { describe, expect, it } from "vitest";
import { describeExhibit, html } from "../../internal/testing";
import { ShippingStreak, Streak } from "./ShippingStreak";
import { meta as exhibit } from "./meta";

describeExhibit(ShippingStreak, exhibit, import.meta.url, ["Shipping streak"]);

describe("ShippingStreak", () => {
  it("renders a dash and empty sockets on the server, at the final size", () => {
    const out = html(ShippingStreak, { start: "2026-09-29", days: 14 });
    expect(out).toContain("–");
    expect(out.match(/bk-ss-tile/g)).toHaveLength(14);
    expect(out).not.toContain("data-on");
  });

  it("shows a given count straight away", () => {
    const out = html(ShippingStreak, { count: 47 });
    expect(out).toContain(">47<");
    expect(out).toContain("days");
  });

  it("never shows the live dot without live data", () => {
    expect(html(ShippingStreak, { user: "octocat" })).not.toContain("bk-live-dot");
  });

  it("keeps the old name", () => {
    expect(Streak).toBe(ShippingStreak);
  });
});
