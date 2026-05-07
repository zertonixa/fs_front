import { useApiQuery } from "@/shared/lib/hooks/useApiQuery";
import type { HistoryCardProps } from "../types";

export function useHistory() {
  const api = useApiQuery<HistoryCardProps[]>({
    key: ["history"],
    path: "/bookings/history",
  });

  return api;
}
