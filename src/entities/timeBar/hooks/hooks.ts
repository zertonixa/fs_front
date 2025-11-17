import { useApiQuery } from "@/shared/lib/hooks/useApiQuery";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { Time } from "./types";

export const useTimeStart = (timeStart: string) =>
  useApiQuery<Time>({
    key: ["slots-start", timeStart],
    path: `/bookings/slots`,
    params: { start: timeStart },
    staleTime: 60_000,
  });

export const useTimeEnd = (timeEnd: string) =>
  useApiQuery<Time>({
    key: ["slots-end", timeEnd],
    path: `/bookings/slots`,
    params: { end: timeEnd },
    staleTime: 60_000,
  });

export const useTimeInterval = (timeStart: string, timeEnd: string) =>
  useApiQuery<Time>({
    key: ["slots-interval", timeStart, timeEnd],
    path: `/bookings/slots`,
    params: { start: timeStart, end: timeEnd },
    staleTime: 60_000,
  });

type SetTimeArgs = {
  startTime?: string | null;
  endTime?: string | null;
};

export const useSetTime = () => {
  const [_, setSearchParams] = useSearchParams();

  const setTime = useCallback(
    ({ startTime, endTime }: SetTimeArgs) => {
      setSearchParams((prev) => {
        const sp = new URLSearchParams(prev);

        if (startTime !== undefined) {
          if (startTime === null || startTime === "") sp.delete("startTime");
          else sp.set("startTime", startTime);
        }

        if (endTime !== undefined) {
          if (endTime === null || endTime === "") sp.delete("endTime");
          else sp.set("endTime", endTime);
        }

        return sp;
      });
    },
    [setSearchParams],
  );

  return { setTime };
};
