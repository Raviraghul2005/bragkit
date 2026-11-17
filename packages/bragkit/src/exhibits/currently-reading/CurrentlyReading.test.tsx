import { describe, expect, it } from "vitest";
import { describeExhibit, html } from "../../internal/testing";
import { CurrentlyReading } from "./CurrentlyReading";
import { meta as exhibit } from "./meta";

describeExhibit(CurrentlyReading, exhibit, import.meta.url, ["Frankenstein", "Mary Shelley", "62%"]);

describe("CurrentlyReading", () => {
  it("hangs the ribbon as far down as you have read, and clamps the number", () => {
    expect(html(CurrentlyReading, { progress: 0.62 })).toContain("height:62%");
    expect(html(CurrentlyReading, { progress: 3 })).toContain('aria-valuenow="100"');
    expect(html(CurrentlyReading, { progress: Number.NaN })).toContain('aria-valuenow="0"');
  });

  it("takes a cover colour", () => {
    expect(html(CurrentlyReading, { color: "#7a2e2e" })).toContain("--bk-accent:#7a2e2e");
  });

  it("makes the book a link when it has an href", () => {
    const out = html(CurrentlyReading, { title: "Dune", href: "https://example.com/dune" });
    expect(out).toContain('href="https://example.com/dune"');
    expect(html(CurrentlyReading, { title: "Dune" })).not.toContain("<a ");
  });
});
