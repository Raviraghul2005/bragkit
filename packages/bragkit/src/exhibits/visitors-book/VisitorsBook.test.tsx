import { describe, expect, it } from "vitest";
import { describeExhibit, html } from "../../internal/testing";
import { VisitorsBook, bookDate } from "./VisitorsBook";
import { meta as exhibit } from "./meta";

describeExhibit(VisitorsBook, exhibit, import.meta.url, ["Mina", "It did not crash once.", "12 Nov 2026", "8 signatures · 1 of 2"]);

describe("VisitorsBook", () => {
  it("says so when the book is empty", () => {
    const out = html(VisitorsBook);
    expect(out).toContain("The book is still empty.");
    expect(out).toContain("0 signatures");
  });

  it("shows six signatures on the first spread and keeps the rest for later pages", () => {
    const out = html(VisitorsBook, exhibit.example);
    expect(out).toContain("Ingrid");
    expect(out).not.toContain("Your mum");
    expect(out).toContain('aria-label="Older signatures"');
  });

  it("is read-only without onSign, and shows a real form with it", () => {
    expect(html(VisitorsBook, { entries: [{ name: "Ada" }] })).not.toContain("<form");
    const out = html(VisitorsBook, { entries: [{ name: "Ada" }], onSign: () => {} });
    expect(out).toContain("<form");
    expect(out).toContain('type="submit"');
    expect(out).toContain("1 signature<");
  });
});

describe("bookDate", () => {
  it("formats ISO days and leaves other text alone", () => {
    expect(bookDate("2026-11-02")).toBe("2 Nov 2026");
    expect(bookDate("2026-11-02", true)).toBe("2 Nov");
    expect(bookDate("Last spring")).toBe("Last spring");
    expect(bookDate(undefined)).toBe("");
  });
});
