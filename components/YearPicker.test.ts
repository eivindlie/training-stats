import { describe, expect, it } from "vitest";

import { getYearPickerLinks } from "./YearPicker";

describe("getYearPickerLinks", () => {
  it("always links back to the previous year", () => {
    expect(getYearPickerLinks(2023, 2024).prevHref).toBe("/?year=2022");
  });

  it("links forward to the next year when not on the current year", () => {
    expect(getYearPickerLinks(2023, 2024).nextHref).toBe("/?year=2024");
  });

  it("has no forward link when already on the current year", () => {
    expect(getYearPickerLinks(2024, 2024).nextHref).toBeNull();
  });
});
