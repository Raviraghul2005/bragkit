import { describe, expect, it } from "vitest";
import { describeExhibit, html } from "../../internal/testing";
import { NowPlaying } from "./NowPlaying";
import { meta as exhibit } from "./meta";

describeExhibit(NowPlaying, exhibit, import.meta.url, ["Baby", "Justin Bieber"]);

describe("NowPlaying", () => {
  it("turns progress into a whole percentage and clamps it", () => {
    expect(html(NowPlaying, { progress: 0.62 })).toContain('aria-valuenow="62"');
    expect(html(NowPlaying, { progress: 4 })).toContain('aria-valuenow="100"');
    expect(html(NowPlaying, { progress: Number.NaN })).toContain('aria-valuenow="0"');
  });

  it("says so when paused", () => {
    const out = html(NowPlaying, { track: "Baby", artist: "Justin Bieber", paused: true });
    expect(out).toContain("data-paused");
    expect(out).toContain("Paused: Baby by Justin Bieber");
  });

  it("links the title when given an href", () => {
    expect(html(NowPlaying, { href: "https://example.com/track" })).toContain('href="https://example.com/track"');
  });
});
