import { describe, expect, it } from "vitest";
import { describeExhibit, html } from "../../internal/testing";
import { PolaroidStack } from "./PolaroidStack";
import { meta as exhibit } from "./meta";

describeExhibit(PolaroidStack, exhibit, import.meta.url, ["tiny-router", "The weather app", "1 / 4"]);

describe("PolaroidStack", () => {
  it("puts the first photo on top and links to it", () => {
    const out = html(PolaroidStack, exhibit.example);
    expect(out).toContain("--bk-p:0");
    expect(out).toContain('href="https://example.com"');
    expect(out).toContain("<button");
  });

  it("draws its own print when a photo has no picture, and uses yours when it has", () => {
    const out = html(PolaroidStack, { photos: [{ caption: "Mine", src: "/mine.png", alt: "A screenshot" }, { caption: "None" }] });
    expect(out).toContain('src="/mine.png"');
    expect(out).toContain('alt="A screenshot"');
    expect(out.match(/bk-ps-art/g)).toHaveLength(1);
  });

  it("has nothing to deal with one photo, and says so with none", () => {
    expect(html(PolaroidStack, { photos: [{ caption: "Only" }] })).not.toContain("<button");
    expect(html(PolaroidStack, { photos: [] })).toContain("No photos yet.");
  });
});
