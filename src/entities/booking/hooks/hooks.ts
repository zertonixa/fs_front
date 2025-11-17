import { useApiQuery } from "@shared/lib/hooks/useApiQuery";
import type { Booking } from "./types";

export const useUserBookings = () =>
  useApiQuery<Booking[]>({
    key: ["user-bookings"],
    path: "/bookings/my",
    staleTime: 60_000,
  });
