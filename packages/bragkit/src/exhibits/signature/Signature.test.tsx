import { describe, expect, it } from "vitest";
import { describeExhibit, html } from "../../internal/testing";
import { Signature, nameSize } from "./Signature";
import { meta as exhibit } from "./meta";

describeExhibit(Signature, exhibit, import.meta.url, ["Ada Lovelace", "London, 1843", "Signed"]);

describe("Signature", () => {
  it("renders the finished signature on the server", () => {
    const out = html(Signature, { name: "Ada Lovelace" });
    expect(out).toContain('data-phase="static"');
    expect(out).toContain('aria-label="Signed: Ada Lovelace"');
    expect(out).toContain("<text");
  });

  it("draws your own path instead of the name when you give one", () => {
    const out = html(Signature, { name: "Ada", path: "M10 60 C 40 10, 60 90, 90 50", viewBox: "0 0 120 80" });
    expect(out).toContain('d="M10 60 C 40 10, 60 90, 90 50"');
    expect(out).toContain('viewBox="0 0 120 80"');
    expect(out).not.toContain("<text");
  });

  it("makes long names smaller so they stay on the slip", () => {
    expect(nameSize("Ada")).toBe(40);
    expect(nameSize("Ada Lovelace")).toBe(36);
    expect(nameSize("Augusta Ada King, Countess of Lovelace")).toBe(16);
  });
});
