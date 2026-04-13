import { useApiQuery } from "@shared/lib/hooks/useApiQuery";
import type { NearestSlot } from "./types";

export const useNearestSlots = (cso: number) =>
  useApiQuery<NearestSlot[]>({
    key: ["user-nearest"],
    path: "/bookings/nearest-available",
    params: {floor: 1, cso: cso, booking_type: "WASHING"},
  });
