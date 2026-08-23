import { format, isValid, parse, startOfMonth } from "date-fns";

const MONTH_YEAR_FORMAT = "MMM yyyy";
/** Day precision, for the few fields that need one (a birth date). Same shape as
 *  the month format so a value stays readable in a plain text input. */
const DAY_MONTH_YEAR_FORMAT = "d MMM yyyy";

export function parseMonthYear(value?: string | null) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return undefined;
  }

  const parsedDate = parse(value, MONTH_YEAR_FORMAT, new Date());

  if (!isValid(parsedDate)) {
    return undefined;
  }

  return startOfMonth(parsedDate);
}

export function formatMonthYear(value: Date) {
  return format(startOfMonth(value), MONTH_YEAR_FORMAT);
}

export function parseDayMonthYear(value?: string | null) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return undefined;
  }

  const parsedDate = parse(value, DAY_MONTH_YEAR_FORMAT, new Date());

  return isValid(parsedDate) ? parsedDate : undefined;
}

export function formatDayMonthYear(value: Date) {
  return format(value, DAY_MONTH_YEAR_FORMAT);
}
