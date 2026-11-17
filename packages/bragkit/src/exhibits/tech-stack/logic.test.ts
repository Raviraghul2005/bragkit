import { describe, expect, it } from "vitest";
import { findLogo, isPale, logoKey, shortName, toGroups, withLogo } from "./logic";
import * as logos from "./logos";

describe("findLogo", () => {
  it("finds a logo however the name is written", () => {
    expect(findLogo("React")?.name).toBe("React");
    expect(findLogo("next.js")?.name).toBe("Next.js");
    expect(findLogo("Node")?.name).toBe("Node.js");
    expect(findLogo("Tailwind CSS")?.name).toBe("Tailwind CSS");
    expect(findLogo("postgresql")?.name).toBe("PostgreSQL");
    expect(findLogo("C++")?.name).toBe("C++");
    expect(findLogo("k8s")?.name).toBe("Kubernetes");
    expect(findLogo("golang")?.name).toBe("Go");
  });

  it("returns nothing for a tool it does not have", () => {
    expect(findLogo("Made Up Tool")).toBeUndefined();
    expect(findLogo("")).toBeUndefined();
  });
});

describe("the built-in logos", () => {
  it("are each one path and one six-digit colour, and there are plenty", () => {
    const all = Object.values(logos);
    expect(all.length).toBeGreaterThan(150);
    for (const logo of all) {
      expect(logo.path, logo.name).toMatch(/^[Mm]/);
      expect(logo.hex, logo.name).toMatch(/^[0-9A-F]{6}$/);
    }
  });
});

describe("logoKey and shortName", () => {
  it("strips a name down to letters and digits", () => {
    expect(logoKey("Next.js")).toBe("nextjs");
    expect(logoKey("C++")).toBe("cplusplus");
    expect(logoKey("C#")).toBe("csharp");
  });

  it("makes key letters for a tool with no logo", () => {
    expect(shortName("Made Up Tool")).toBe("MU");
    expect(shortName("Zig")).toBe("Zi");
    expect(shortName("AWS")).toBe("AWS");
    expect(shortName("C#")).toBe("C#");
  });
});

describe("isPale", () => {
  it("spots colours that would vanish on a cream keycap", () => {
    expect(isPale("F7DF1E")).toBe(true);
    expect(isPale("FFFFFF")).toBe(true);
    expect(isPale("3178C6")).toBe(false);
    expect(isPale("000000")).toBe(false);
    expect(isPale("nope")).toBe(false);
  });
});

describe("withLogo and toGroups", () => {
  it("fills in logos for names and leaves your own items alone", () => {
    expect(withLogo("react").name).toBe("React");
    expect(withLogo("react").path).toBe(logos.react.path);
    expect(withLogo({ name: "Mine", src: "/mine.svg" })).toEqual({ name: "Mine", src: "/mine.svg" });
    expect(withLogo({ name: "Go", wide: true }).wide).toBe(true);
  });

  it("keeps rows in the order they first appear", () => {
    const rows = toGroups([{ name: "a", group: "B" }, { name: "b" }, { name: "c", group: "B" }], undefined);
    expect(rows.map((r) => r.label)).toEqual(["B", undefined]);
    expect(rows[0].items.map((i) => i.name)).toEqual(["a", "c"]);
  });
});
