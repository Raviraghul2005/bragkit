import { describe, expect, it } from "vitest";
import { describeExhibit, html } from "../../internal/testing";
import { CallingCards } from "./CallingCards";
import { meta as exhibit } from "./meta";

describeExhibit(CallingCards, exhibit, import.meta.url, ["GitHub", "@ada", "ada@example.com"]);

describe("CallingCards", () => {
  it("makes every card a real link and tells the fan how many there are", () => {
    const out = html(CallingCards, {
      links: [
        { label: "GitHub", handle: "@ada", href: "https://github.com/ada" },
        { label: "Email", handle: "ada@example.com", href: "mailto:ada@example.com" },
      ],
    });
    expect(out.match(/<a /g)).toHaveLength(2);
    expect(out).toContain('href="mailto:ada@example.com"');
    expect(out).toContain("--bk-n:2");
    expect(out).toContain("--bk-i:1");
  });

  it("keeps your own style beside its own", () => {
    expect(html(CallingCards, { style: { "--bk-accent": "#ff6b00" } })).toMatch(/--bk-n:2;--bk-accent:#ff6b00/);
  });
});
