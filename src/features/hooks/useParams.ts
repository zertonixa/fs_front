import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

type Params = {
  startTime?: string | null;
  endTime?: string | null;
  places: string[];
  floor?: string | null;
};

const parseBookingParams = (sp: URLSearchParams): Params => {
  const startTime = sp.get("startTime");
  const endTime = sp.get("endTime");
  const floor = sp.get("floor");

  const rawPlaces = sp.get("places");
  const places = rawPlaces ? rawPlaces.split(",").filter(Boolean) : [];

  return {
    startTime,
    endTime,
    floor,
    places,
  };
};

const serializeBookingParams = (
  prevSp: URLSearchParams,
  params: Params,
): URLSearchParams => {
  const sp = new URLSearchParams(prevSp);

  if (!params.startTime) sp.delete("startTime");
  else sp.set("startTime", params.startTime);

  if (!params.endTime) sp.delete("endTime");
  else sp.set("endTime", params.endTime);

  if (!params.floor) sp.delete("floor");
  else sp.set("floor", params.floor);

  if (!params.places.length) sp.delete("places");
  else sp.set("places", params.places.join(","));

  return sp;
};

export function useBookingParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateBookingParams = useCallback(
    (updater: (prev: Params) => Params) => {
      setSearchParams((prevSp) => {
        const prev = parseBookingParams(prevSp);
        const next = updater(prev);
        return serializeBookingParams(prevSp, next);
      });
    },
    [setSearchParams],
  );

  const setTime = useCallback(
    (args: { startTime?: string | null; endTime?: string | null }) => {
      updateBookingParams((prev) => ({
        ...prev,
        startTime:
          args.startTime === undefined ? prev.startTime : args.startTime,
        endTime: args.endTime === undefined ? prev.endTime : args.endTime,
      }));
    },
    [updateBookingParams],
  );

  const togglePlace = useCallback(
    (places: string[]) => {
      updateBookingParams((prev) => {
        return {
          ...prev,
          places: places,
        };
      });
    },
    [updateBookingParams],
  );

  const setFloor = useCallback(
    (floor: string | null) => {
      updateBookingParams((prev) => ({
        ...prev,
        floor,
      }));
    },
    [updateBookingParams],
  );

  const current = parseBookingParams(searchParams);

  return {
    params: current,
    setTime,
    togglePlace,
    setFloor,
  };
}
