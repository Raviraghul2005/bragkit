import { describe, expect, it } from "vitest";
import { findLogo, isPale, logoKey, shortName, withLogos } from "./logic";
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
  });

  it("returns nothing for a tool it does not have", () => {
    expect(findLogo("Made Up Tool")).toBeUndefined();
    expect(findLogo("")).toBeUndefined();
  });
});

describe("the built-in logos", () => {
  it("are each one path and one six-digit colour", () => {
    const all = Object.values(logos);
    expect(all.length).toBeGreaterThan(40);
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

  it("makes two letters for a tool with no logo", () => {
    expect(shortName("Made Up Tool")).toBe("MU");
    expect(shortName("Zig")).toBe("Zi");
    expect(shortName("!")).toBe("!");
  });
});

describe("isPale", () => {
  it("spots colours that would vanish on a white mat", () => {
    expect(isPale("00FF74")).toBe(true);
    expect(isPale("FFFFFF")).toBe(true);
    expect(isPale("3178C6")).toBe(false);
    expect(isPale("000000")).toBe(false);
    expect(isPale("nope")).toBe(false);
  });
});

describe("withLogos", () => {
  it("fills in logos for names and leaves your own items alone", () => {
    const [a, b, c] = withLogos(["react", { name: "Mine", src: "/mine.svg" }, { name: "Go", href: "https://go.dev" }]);
    expect(a.name).toBe("React");
    expect(a.path).toBe(logos.react.path);
    expect(b).toEqual({ name: "Mine", src: "/mine.svg" });
    expect(c.href).toBe("https://go.dev");
    expect(c.path).toBe(logos.go.path);
  });
});
