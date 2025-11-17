import { useSearchParams } from "react-router-dom";
import { parseISO, format, addDays, differenceInCalendarDays } from "date-fns";
import { useCallback, useMemo } from "react";

const isSameDay = (a: Date | null, b: Date) =>
  !!a && a.getTime() === b.getTime();

export function useBookingRange() {
  const [searchParams, setSearchParams] = useSearchParams();

  const startDate = useMemo(() => {
    const p = searchParams.get("start");
    return p ? parseISO(p) : null;
  }, [searchParams]);

  const endDate = useMemo(() => {
    const p = searchParams.get("end");
    return p ? parseISO(p) : null;
  }, [searchParams]);

  const setRange = useCallback(
    (start: Date | null, end: Date | null) => {
      setSearchParams((prev) => {
        const sp = new URLSearchParams(prev);

        if (start) sp.set("start", format(start, "yyyy-MM-dd"));
        else sp.delete("start");

        if (end) sp.set("end", format(end, "yyyy-MM-dd"));
        else sp.delete("end");

        return sp;
      });
    },
    [setSearchParams],
  );

  const handleDayClick = useCallback(
    (day: Date, maxRange: number | null) => {
      if (isSameDay(startDate, day) && !endDate) {
        setRange(null, null);
        return;
      }

      if (isSameDay(startDate, day) || isSameDay(endDate, day)) {
        setRange(null, null);
        return;
      }

      if (!startDate && !endDate) {
        setRange(day, null);
        return;
      }

      if (startDate && !endDate) {
        if (!maxRange) {
          if (day < startDate) {
            setRange(day, startDate);
          } else {
            setRange(startDate, day);
          }
          return;
        }

        const diff = Math.abs(differenceInCalendarDays(day, startDate));

        if (diff <= maxRange) {
          if (day < startDate) {
            setRange(day, startDate);
          } else {
            setRange(startDate, day);
          }
          return;
        }

        if (day > startDate) {
          const newEnd = day;
          const newStart = addDays(newEnd, -maxRange);
          setRange(newStart, newEnd);
        } else {
          const newStart = day;
          const newEnd = addDays(newStart, maxRange);
          setRange(newStart, newEnd);
        }
        return;
      }

      if (startDate && endDate) {
        if (!maxRange) {
          setRange(day, null);
          return;
        }

        if (day > endDate) {
          const newEnd = day;
          const newStart = addDays(newEnd, -maxRange);
          setRange(newStart, newEnd);
          return;
        }

        if (day < startDate) {
          const newStart = day;
          const newEnd = addDays(newStart, maxRange);
          setRange(newStart, newEnd);
          return;
        }

        setRange(day, null);
      }
    },
    [startDate, endDate, setRange],
  );

  const isSelected = useCallback(
    (date: Date) => isSameDay(startDate, date) || isSameDay(endDate, date),
    [startDate, endDate],
  );

  return { startDate, endDate, setRange, handleDayClick, isSelected };
}
