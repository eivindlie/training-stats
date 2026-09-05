import { describe, expect, it } from "vitest";

import { formatTime, summarizeActivities } from "./ActivityStats";
import { makeActivity } from "./testFixtures";

describe("formatTime", () => {
  it.each([
    [0, "00:00:00"],
    [59, "00:00:59"],
    [60, "00:01:00"],
    [3661, "01:01:01"],
    [36000, "10:00:00"],
  ])("formats %i seconds as %s", (seconds, expected) => {
    expect(formatTime(seconds)).toBe(expected);
  });
});

describe("summarizeActivities", () => {
  it("returns zeroed stats for an empty list", () => {
    expect(summarizeActivities([])).toEqual({
      count: 0,
      totalDistanceKm: 0,
      averageDistanceKm: 0,
      totalTime: 0,
      averageTime: 0,
    });
  });

  it("sums and averages distance and time across activities", () => {
    const activities = [
      makeActivity({ distance: 5000, moving_time: 1800 }),
      makeActivity({ distance: 10000, moving_time: 3600 }),
    ];

    const stats = summarizeActivities(activities);

    expect(stats.count).toBe(2);
    expect(stats.totalDistanceKm).toBe(15);
    expect(stats.averageDistanceKm).toBe(7.5);
    expect(stats.totalTime).toBe(5400);
    expect(stats.averageTime).toBe(2700);
  });
});
