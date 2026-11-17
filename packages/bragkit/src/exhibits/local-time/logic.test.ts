import { describe, expect, it } from "vitest";
import { guessActivity, placeFromZone, readClock } from "./logic";

describe("readClock", () => {
  // 02:14 UTC on a winter day: Lisbon is on UTC.
  const winter = new Date("2026-01-15T02:14:00Z");

  it("formats a 12-hour clock with a period", () => {
    expect(readClock(winter, "Europe/Lisbon", true)).toEqual({
      time: "02:14",
      period: "AM",
      hour: 2,
      minuteOfDay: 134,
    });
  });

  it("formats a 24-hour clock without a period", () => {
    const r = readClock(new Date("2026-01-15T15:05:00Z"), "Europe/Lisbon", false);
    expect(r.time).toBe("15:05");
    expect(r.period).toBe("");
    expect(r.hour).toBe(15);
  });

  it("applies the zone offset and summer time", () => {
    expect(readClock(winter, "Asia/Kolkata", true).time).toBe("07:44");
    expect(readClock(new Date("2026-07-15T02:14:00Z"), "Europe/Lisbon", false).time).toBe("03:14");
  });

  it("reads midnight as hour 0", () => {
    const r = readClock(new Date("2026-01-15T00:30:00Z"), "UTC", true);
    expect(r.hour).toBe(0);
    expect(r.time).toBe("12:30");
    expect(r.minuteOfDay).toBe(30);
  });
});

describe("placeFromZone", () => {
  it("takes the city and spaces out underscores", () => {
    expect(placeFromZone("Europe/Lisbon")).toBe("Lisbon");
    expect(placeFromZone("America/New_York")).toBe("New York");
    expect(placeFromZone("America/Argentina/Buenos_Aires")).toBe("Buenos Aires");
    expect(placeFromZone("UTC")).toBe("UTC");
  });
});

describe("guessActivity", () => {
  it("covers the whole day", () => {
    expect(guessActivity(2)).toBe("asleep, probably");
    expect(guessActivity(7)).toBe("up early");
    expect(guessActivity(12)).toBe("working hours");
    expect(guessActivity(19)).toBe("evening");
    expect(guessActivity(23)).toBe("up late");
  });
});
