"use client";

import { useMemo, useState } from "react";
import {
  addYears,
  eachDayOfInterval,
  endOfMonth,
  format,
  getYear,
  setMonth,
  startOfMonth,
  startOfYear,
} from "date-fns";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  formatDayMonthYear,
  formatMonthYear,
  parseDayMonthYear,
  parseMonthYear,
} from "@/features/resume-editor/domain/month-year";
import { FIELD_CONTROL_CLASS } from "@/features/resume-editor/forms/fields/field-control";
import { cn } from "@/lib/utils";

type MonthYearPickerProps = {
  id: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  ariaInvalid?: boolean;
  minValue?: string;
  /** `"day"` adds a day grid under the months and stores `"12 Jun 1994"`. The
   *  months alone answer every dated section; only a birth date needs the day. */
  precision?: "month" | "day";
};

function isMonthSelected(monthDate: Date, selectedDate: Date | undefined) {
  return (
    !!selectedDate &&
    selectedDate.getFullYear() === monthDate.getFullYear() &&
    selectedDate.getMonth() === monthDate.getMonth()
  );
}

export function isMonthDisabled(monthDate: Date, minDate: Date | undefined) {
  return !!minDate && monthDate.getTime() < minDate.getTime();
}

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function MonthYearPicker({
  id,
  value,
  onChange,
  placeholder = "Select month and year",
  disabled = false,
  ariaInvalid = false,
  minValue,
  precision = "month",
}: MonthYearPickerProps) {
  const withDay = precision === "day";
  const selectedDate = useMemo(
    () => (withDay ? parseDayMonthYear(value) : parseMonthYear(value)),
    [value, withDay],
  );
  const minDate = useMemo(() => parseMonthYear(minValue), [minValue]);
  const [open, setOpen] = useState(false);
  const [displayMonth, setDisplayMonth] = useState<Date>(
    selectedDate ?? startOfMonth(new Date()),
  );
  const displayYearStart = startOfYear(displayMonth);
  const previousYear = getYear(displayMonth) - 1;
  const isPreviousYearDisabled =
    !!minDate && previousYear < getYear(minDate);

  function handleSelectMonth(monthIndex: number) {
    const nextDate = setMonth(displayYearStart, monthIndex);

    if (minDate && nextDate.getTime() < minDate.getTime()) {
      return;
    }

    setDisplayMonth(nextDate);
    // With a day grid the month is only navigation — the day commits.
    if (withDay) return;

    onChange(formatMonthYear(nextDate));
    setOpen(false);
  }

  function handleSelectDay(day: Date) {
    onChange(formatDayMonthYear(day));
    setDisplayMonth(day);
    setOpen(false);
  }

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen && selectedDate) {
          setDisplayMonth(selectedDate);
        }

        setOpen(nextOpen);
      }}
    >
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            aria-invalid={ariaInvalid}
            className={cn(
              FIELD_CONTROL_CLASS,
              "justify-start font-normal",
              !value && "text-muted-foreground",
            )}
          />
        }
      >
        <CalendarIcon className="size-4 text-muted-foreground" />
        <span>{value || placeholder}</span>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[320px] gap-4 rounded-md">
        <div className="flex items-center justify-between rounded-[10px] border bg-background px-3 py-2">
          <div className="flex items-center gap-1">
            {withDay ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() =>
                  setDisplayMonth((currentMonth) => addYears(currentMonth, -10))
                }
                aria-label={`Show ${getYear(displayMonth) - 10}`}
              >
                <ChevronsLeftIcon />
              </Button>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={isPreviousYearDisabled}
              onClick={() =>
                setDisplayMonth((currentMonth) => addYears(currentMonth, -1))
              }
              aria-label={`Show ${getYear(displayMonth) - 1}`}
            >
              <ChevronLeftIcon />
            </Button>
          </div>
          <div className="text-sm font-medium">{getYear(displayMonth)}</div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() =>
                setDisplayMonth((currentMonth) => addYears(currentMonth, 1))
              }
              aria-label={`Show ${getYear(displayMonth) + 1}`}
            >
              <ChevronRightIcon />
            </Button>
            {withDay ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() =>
                  setDisplayMonth((currentMonth) => addYears(currentMonth, 10))
                }
                aria-label={`Show ${getYear(displayMonth) + 10}`}
              >
                <ChevronsRightIcon />
              </Button>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {monthLabels.map((monthLabel, monthIndex) => {
            const monthDate = setMonth(displayYearStart, monthIndex);

            return (
              <Button
                key={monthLabel}
                type="button"
                aria-pressed={isMonthSelected(monthDate, selectedDate)}
                variant="outline"
                className="justify-center aria-pressed:border-transparent aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:hover:bg-primary/80 aria-pressed:hover:text-primary-foreground"
                disabled={isMonthDisabled(monthDate, minDate)}
                onClick={() => handleSelectMonth(monthIndex)}
              >
                {format(monthDate, "MMM")}
              </Button>
            );
          })}
        </div>

        {withDay ? (
          <div className="grid grid-cols-7 gap-1">
            {eachDayOfInterval({
              start: startOfMonth(displayMonth),
              end: endOfMonth(displayMonth),
            }).map((day) => (
              <Button
                key={day.toISOString()}
                type="button"
                size="icon-sm"
                variant="ghost"
                aria-pressed={
                  !!selectedDate &&
                  selectedDate.toDateString() === day.toDateString()
                }
                className="aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:hover:bg-primary/80"
                onClick={() => handleSelectDay(day)}
              >
                {format(day, "d")}
              </Button>
            ))}
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
