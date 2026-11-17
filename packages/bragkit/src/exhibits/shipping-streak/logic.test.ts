import { describe, expect, it } from "vitest";
import { addDays, daysBetween, toDayKey } from "../../internal/days";
import { countStreak, lastDays, pushDates, shippedDays } from "./logic";

describe("day keys", () => {
  it("keeps date-only strings as they are", () => {
    expect(toDayKey("2026-11-14", "Asia/Tokyo")).toBe("2026-11-14");
  });

  it("puts a moment on the calendar day of the zone", () => {
    const late = "2026-11-14T23:30:00Z";
    expect(toDayKey(late, "UTC")).toBe("2026-11-14");
    expect(toDayKey(late, "Asia/Tokyo")).toBe("2026-11-15");
    expect(toDayKey(late, "America/Los_Angeles")).toBe("2026-11-14");
  });

  it("ignores dates it cannot read", () => {
    expect(toDayKey("not a date")).toBeNull();
  });

  it("adds days across months, years and daylight saving", () => {
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-03-29", 1)).toBe("2026-03-30");
    expect(daysBetween("2026-11-01", "2026-11-14")).toBe(13);
  });
});

describe("countStreak", () => {
  const today = "2026-11-14";

  it("counts back from today", () => {
    const days = new Set(["2026-11-12", "2026-11-13", "2026-11-14"]);
    expect(countStreak(days, today)).toBe(3);
  });

  it("keeps yesterday's streak alive until today is over", () => {
    const days = new Set(["2026-11-12", "2026-11-13"]);
    expect(countStreak(days, today)).toBe(2);
  });

  it("stops at the first missed day", () => {
    const days = new Set(["2026-11-10", "2026-11-11", "2026-11-13", "2026-11-14"]);
    expect(countStreak(days, today)).toBe(2);
  });

  it("is zero when the last two days were missed", () => {
    expect(countStreak(new Set(["2026-11-11"]), today)).toBe(0);
    expect(countStreak(new Set(), today)).toBe(0);
  });

  it("dedupes several ships on one day", () => {
    const days = shippedDays(["2026-11-14T08:00:00Z", "2026-11-14T20:00:00Z", "2026-11-13"], "UTC");
    expect(countStreak(days, today)).toBe(2);
  });
});

describe("lastDays", () => {
  it("lists the last n days, oldest first", () => {
    expect(lastDays("2026-11-02", 3)).toEqual(["2026-10-31", "2026-11-01", "2026-11-02"]);
  });
});

describe("pushDates", () => {
  it("keeps pushes and creations, nothing else", () => {
    expect(
      pushDates([
        { type: "PushEvent", created_at: "2026-11-14T10:00:00Z" },
        { type: "WatchEvent", created_at: "2026-11-13T10:00:00Z" },
        { type: "CreateEvent", created_at: "2026-11-12T10:00:00Z" },
        { type: "PushEvent" },
      ]),
    ).toEqual(["2026-11-14T10:00:00Z", "2026-11-12T10:00:00Z"]);
  });
});
