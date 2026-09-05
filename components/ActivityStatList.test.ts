import { describe, expect, it } from "vitest";

import { groupActivitiesByDisplayType } from "./ActivityStatList";
import { makeActivity } from "./testFixtures";

describe("groupActivitiesByDisplayType", () => {
  it("omits activity types with no activities", () => {
    const groups = groupActivitiesByDisplayType([makeActivity({ type: "Run" })]);

    expect(groups.map((g) => g.type)).toEqual(["Run"]);
  });

  it("groups activities under their matching display type", () => {
    const groups = groupActivitiesByDisplayType([
      makeActivity({ type: "Run" }),
      makeActivity({ type: "Run" }),
      makeActivity({ type: "Hike" }),
    ]);

    const run = groups.find((g) => g.type === "Run");
    const hike = groups.find((g) => g.type === "Hike");

    expect(run?.activities).toHaveLength(2);
    expect(hike?.activities).toHaveLength(1);
  });

  it("ignores activity types that aren't in the display list", () => {
    const groups = groupActivitiesByDisplayType([makeActivity({ type: "Swim" })]);

    expect(groups).toHaveLength(0);
  });
});
