import { describe, expect, it } from "vitest";
import { describeExhibit, html } from "../../internal/testing";
import { HeadCount, wheelDigits } from "./HeadCount";
import { meta as exhibit } from "./meta";

describeExhibit(HeadCount, exhibit, import.meta.url, ["1,284 visitors"]);

describe("HeadCount", () => {
  it("renders the real number on the server, one wheel per digit", () => {
    const out = html(HeadCount, { count: 1284 });
    expect(out.match(/class="bk-hc-wheel"/g)).toHaveLength(5);
    expect(out).toContain("--bk-d:4");
    expect(out).toContain('aria-label="1,284 visitors"');
  });

  it("only shows the live dot when told the count is live", () => {
    expect(html(HeadCount, { count: 3 })).not.toContain("bk-live-dot");
    expect(html(HeadCount, { count: 3, live: true })).toContain("bk-live-dot");
  });
});

describe("wheelDigits", () => {
  it("pads to the number of wheels and grows when it has to", () => {
    expect(wheelDigits(42, 5)).toEqual([0, 0, 0, 4, 2]);
    expect(wheelDigits(123456, 5)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("treats nonsense as zero", () => {
    expect(wheelDigits(-5, 3)).toEqual([0, 0, 0]);
    expect(wheelDigits(Number.NaN, 2)).toEqual([0, 0]);
    expect(wheelDigits(7.9, 1)).toEqual([7]);
  });
});
