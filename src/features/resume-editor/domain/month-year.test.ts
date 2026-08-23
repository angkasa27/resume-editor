import { describe, expect, it } from "vitest";

import {
  formatDayMonthYear,
  formatMonthYear,
  parseDayMonthYear,
  parseMonthYear,
} from "@/features/resume-editor/domain/month-year";

describe("parseMonthYear", () => {
  it("parses a valid month-year string", () => {
    const result = parseMonthYear("Jan 2024");
    expect(result).toBeInstanceOf(Date);
    expect(result!.getMonth()).toBe(0);
    expect(result!.getFullYear()).toBe(2024);
  });

  it("returns undefined for null/undefined", () => {
    expect(parseMonthYear(null)).toBeUndefined();
    expect(parseMonthYear(undefined)).toBeUndefined();
  });

  it("returns undefined for empty string", () => {
    expect(parseMonthYear("")).toBeUndefined();
    expect(parseMonthYear("   ")).toBeUndefined();
  });

  it("returns undefined for malformed input", () => {
    expect(parseMonthYear("not-a-date")).toBeUndefined();
    expect(parseMonthYear("2024-01")).toBeUndefined();
    expect(parseMonthYear("Januar 2024")).toBeUndefined();
  });

  it("returns start of month", () => {
    const result = parseMonthYear("Mar 2024");
    expect(result!.getDate()).toBe(1);
  });
});

describe("formatMonthYear", () => {
  it("formats a date as MMM yyyy", () => {
    expect(formatMonthYear(new Date(2024, 0, 15))).toBe("Jan 2024");
    expect(formatMonthYear(new Date(2024, 5, 1))).toBe("Jun 2024");
    expect(formatMonthYear(new Date(2023, 11, 31))).toBe("Dec 2023");
  });

  it("normalizes to start of month", () => {
    const result = formatMonthYear(new Date(2024, 2, 20));
    expect(result).toBe("Mar 2024");
  });
});

/** Day precision exists for the 履歴書's 生年月日, which prints the day. It is a
 *  separate format on purpose: a month-only value must not silently read as the
 *  first of that month, and vice versa. */
describe("day precision", () => {
  it("round-trips a date through the picker's format", () => {
    const value = formatDayMonthYear(new Date(1994, 5, 12));
    expect(value).toBe("12 Jun 1994");
    expect(parseDayMonthYear(value)!.getDate()).toBe(12);
  });

  it("keeps the day, where the month parser would flatten it", () => {
    expect(parseDayMonthYear("12 Jun 1994")!.getDate()).toBe(12);
    expect(parseMonthYear("Jun 1994")!.getDate()).toBe(1);
  });

  it("rejects a month-only value and other malformed input", () => {
    expect(parseDayMonthYear("Jun 1994")).toBeUndefined();
    expect(parseDayMonthYear("1994-06-12")).toBeUndefined();
    expect(parseDayMonthYear("")).toBeUndefined();
    expect(parseDayMonthYear(undefined)).toBeUndefined();
  });
});
