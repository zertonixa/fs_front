import { useApiQuery } from "@/shared/lib/hooks/useApiQuery";
import { useSearchParams } from "react-router-dom";
import type { Slot } from "./types";
import { useApiMutation } from "@/shared/lib/hooks/useApiMutation";

export function useBookingParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const togglePlace = (place: number) => {
    const placeStr = String(place);

    setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);

      const raw = sp.get("places");
      const list = raw ? raw.split(",").filter(Boolean) : [];

      const exists = list.includes(placeStr);

      let next: string[];

      if (exists) {
        next = list.filter((p) => p !== placeStr);
      } else {
        if (list.length >= 6) return sp;
        next = [...list, placeStr];
      }

      if (next.length === 0) sp.delete("places");
      else sp.set("places", next.join(","));

      return sp;
    });
  };

  const selectedPlaces = (() => {
    const raw = searchParams.get("places");
    return raw ? raw.split(",").filter(Boolean) : [];
  })();

  return {
    selectedPlaces,
    togglePlace,
  };
}


export const useSlots = ({ type, floor, cso }: { type: "WASHING" | "DRYING"; floor: number; cso: number }) => {
  console.log(type, floor, cso)
  return useApiQuery<Slot[][]>({
    key: ["slots", cso],
    path: "/slots",
    params: { type, floor_: floor, cso_: cso },
  });
};

  export const useOverlaps = ({floor, cso, type, starts_at, ends_at, enabled = true}: {type: "WASHING" | "DRYING", floor: number, cso: number, starts_at: Date, ends_at: Date, enabled?: boolean}) => 
    useApiQuery<Slot[][]>({
    key: ["slots-overlaps"],
    path: "/bookings/overlaps",
    params: {type: type, floor: floor, cso: cso, starts_at: starts_at, ends_at: ends_at},
    enabled: enabled
  });

export type CreateSlotPayload = {
  type: "WASHING" | "DRYING";
  floor: number;
  place: number;
  cso: 1 | 3 | 4;
  row: number;
  status: boolean;
};

export const useChangeSlot = () => {
  const createSlot = useApiMutation<Slot, CreateSlotPayload>(
    "/slots",
    "post",
    { invalidate: ["slots"] }
  );

  const deleteSlot = useApiMutation<void, { id: string }>(
    ({ id }) => `/slots/${id}`,
    "delete",
    { invalidate: ["slots"] }
  );

  const toggleSlotStatus = useApiMutation<Slot, { id: string }>(
    ({ id }) => `/slots/${id}/toggle-status`,
    "patch",
    { invalidate: ["slots"] }
  );

  return {
    createSlot,
    deleteSlot,
    toggleSlotStatus,
  };
};