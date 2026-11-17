import { describe, expect, it } from "vitest";
import { describeExhibit, html } from "../../internal/testing";
import { OpenForWork } from "./OpenForWork";
import { meta as exhibit } from "./meta";

describeExhibit(OpenForWork, exhibit, import.meta.url, ["Open", "Freelance, from January", "Say hello"]);

describe("OpenForWork", () => {
  it("shows the open side by default, with a real button to turn it", () => {
    const out = html(OpenForWork);
    expect(out).toContain('data-side="open"');
    expect(out).toContain("<button");
    expect(out).toContain("Open for work. Turn the sign over.");
  });

  it("shows the closed side and hides the link when closed", () => {
    const out = html(OpenForWork, { open: false, href: "mailto:a@b.c" });
    expect(out).toContain('data-side="closed"');
    expect(out).toContain("Closed for now. Turn the sign over.");
    expect(out).not.toContain("mailto:");
  });

  it("does not swing until it has been turned", () => {
    expect(html(OpenForWork)).not.toContain("data-swing");
  });
});
