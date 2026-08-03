import { describe, expect, it } from "vitest";

import { isMonthDisabled } from "@/features/resume-editor/forms/fields/month-year-picker";

describe("isMonthDisabled", () => {
  it("allows selecting the same month as minDate (so a one-month stint is selectable)", () => {
    expect(isMonthDisabled(new Date(2024, 0, 1), new Date(2024, 0, 1))).toBe(
      false,
    );
  });

  it("disables months before minDate", () => {
    expect(isMonthDisabled(new Date(2023, 11, 1), new Date(2024, 0, 1))).toBe(
      true,
    );
  });

  it("allows months after minDate", () => {
    expect(isMonthDisabled(new Date(2024, 1, 1), new Date(2024, 0, 1))).toBe(
      false,
    );
  });

  it("allows anything when there is no minDate", () => {
    expect(isMonthDisabled(new Date(2020, 0, 1), undefined)).toBe(false);
  });
});
