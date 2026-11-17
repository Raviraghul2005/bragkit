import { describe, expect, it } from "vitest";
import { describeExhibit, html } from "../../internal/testing";
import { PinnedRepo, formatStars } from "./PinnedRepo";
import { meta as exhibit } from "./meta";

describeExhibit(PinnedRepo, exhibit, import.meta.url, ["tiny-router", "A file-based router in 900 bytes.", "1.3k", "TypeScript"]);

describe("PinnedRepo", () => {
  it("is a link when it has an href and a plain frame when it does not", () => {
    expect(html(PinnedRepo, { name: "a", href: "https://example.com/a" })).toMatch(/^<a [^>]*href="https:\/\/example\.com\/a"/);
    expect(html(PinnedRepo, { name: "a" })).toMatch(/^<div /);
  });

  it("leaves out what it was not given", () => {
    const out = html(PinnedRepo, { name: "a" });
    expect(out).not.toContain("bk-medal");
    expect(out).not.toContain("bk-pr-lang");
  });
});

describe("formatStars", () => {
  it("shortens thousands and leaves small numbers and text alone", () => {
    expect(formatStars(980)).toBe("980");
    expect(formatStars(1000)).toBe("1k");
    expect(formatStars(1284)).toBe("1.3k");
    expect(formatStars(15300)).toBe("15k");
    expect(formatStars("12.4k")).toBe("12.4k");
    expect(formatStars(-4)).toBe("0");
  });
});
