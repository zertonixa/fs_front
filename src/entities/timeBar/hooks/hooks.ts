import { useApiQuery } from "@/shared/lib/hooks/useApiQuery";
import type { Time } from "./types";

export const useTimeStart = (timeStart: string) =>
  useApiQuery<Time>({
    key: ["slots-start", timeStart],
    path: `/bookings/slots`,
    params: { start: timeStart },
  });

export const useTimeEnd = (timeEnd: string) =>
  useApiQuery<Time>({
    key: ["slots-end", timeEnd],
    path: `/bookings/slots`,
    params: { end: timeEnd },
  });

export const useTimeInterval = (timeStart: string, timeEnd: string) =>
  useApiQuery<Time>({
    key: ["slots-interval", timeStart, timeEnd],
    path: `/bookings/slots`,
    params: { start: timeStart, end: timeEnd },
  });

export const useAvailableStarts = (
  floor: number,
  cso: number,
  type: string,
  fromDate: Date,
) => {
  return useApiQuery<string[]>({
    key: [
      "available-starts",
      floor,
      cso,
      type,
      fromDate.toISOString().split("T")[0],
    ],
    path: "/bookings/available-starts",
    params: {
      floor,
      cso,
      type,
      from: fromDate.toISOString(),
      to: new Date(fromDate.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    },
  });
};

export const useAvailableEnds = (
  floor: number,
  cso: number,
  type: string,
  startDate: string,
  endLimitDate?: string,
) => {
  const getStartOfNextDay = (date: string): Date => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(0, 0, 0, 0);
    return nextDay;
  };

  return useApiQuery<string[]>({
    key: [
      "available-ends",
      floor,
      cso,
      type,
      startDate,
      endLimitDate?.split("T")[0],
    ],
    path: "/bookings/available-ends",
    params: {
      floor,
      cso,
      type,
      start: startDate,
      end: endLimitDate ? getStartOfNextDay(endLimitDate) : undefined,
    },
    enabled: !!startDate,
  });
};
