import { useApiQuery } from "@/shared/lib/hooks/useApiQuery";
import type { Report, ReportFilters } from "../models";

export const useGetReports = (params: ReportFilters) => {
  const api = useApiQuery<Report[]>({
    key: ["reports", "reports_me"],
    path: "complaints",
    params: { ...params },
  });
  return api;
};

export const useMyReports = () => {
  const api = useApiQuery<Report[]>({
    key: ["reports", "reports_me"],
    path: "complaints/me",
  });
  return api;
};
