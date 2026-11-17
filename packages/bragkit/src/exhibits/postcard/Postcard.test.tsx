import { describe, expect, it } from "vitest";
import { describeExhibit, html } from "../../internal/testing";
import { Postcard } from "./Postcard";
import { meta as exhibit } from "./meta";

describeExhibit(Postcard, exhibit, import.meta.url, ["Lisbon", "Wish you were here.", "ada@example.com"]);

describe("Postcard", () => {
  it("shows the front first and keeps the back out of the tab order", () => {
    const out = html(Postcard, { place: "Lisbon", email: "ada@example.com" });
    expect(out).toContain('data-side="front"');
    expect(out).toContain("Postcard from Lisbon. Turn it over.");
    expect(out).toMatch(/href="mailto:ada@example\.com" tabindex="-1"/);
  });

  it("can start turned over", () => {
    const out = html(Postcard, { flipped: true, email: "ada@example.com" });
    expect(out).toContain('data-side="back"');
    expect(out).toMatch(/href="mailto:ada@example\.com" tabindex="0"/);
  });

  it("leaves a blank line when there is no email", () => {
    expect(html(Postcard)).not.toContain("mailto:");
  });
});
