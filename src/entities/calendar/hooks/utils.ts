import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isBefore,
  startOfDay,
} from "date-fns";
import type { CalendarDay } from "./types";

export function buildMonthDays(month: Date): CalendarDay[] {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);

  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: CalendarDay[] = [];
  let current = gridStart;

  while (current <= gridEnd) {
    days.push({
      date: current,
      inCurrentMonth: isSameMonth(current, month),
      isEnded: isBefore(startOfDay(current), startOfDay(new Date())),
    });
    current = addDays(current, 1);
  }

  return days;
}
