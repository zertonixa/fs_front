import { useApiQuery } from "@shared/lib/hooks/useApiQuery";
import type { Slot } from "./types";

export const useNearestSlots = () =>
  useApiQuery<Slot[]>({
    key: ["user-slots"],
    path: "/bookings/nearest",
    staleTime: 60_000,
  });
