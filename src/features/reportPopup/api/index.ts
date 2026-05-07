import { useApiMutation } from "@/shared/lib/hooks/useApiMutation";
import type { ReportStatus, Report } from "@entities/reportCard/models";

export const useCreateReport = () => {
  return useApiMutation<Report, FormData>("/complaints", "post", {
    invalidate: ["reports", "reports_me"],
  });
};

export const useUpdateReport = () => {
  return useApiMutation<Report, { id: string; status: ReportStatus }>(
    ({ id }) => `/complaints/${id}/status`,
    "patch",
    { invalidate: ["reports", "reports_me"] },
  );
};

export const useUpdateReportText = () => {
  return useApiMutation<Report, { id: string; text: string }>(
    ({ id }) => `/complaints/${id}`,
    "patch",
    { invalidate: ["reports", "reports_me"] },
  );
};

export const useDeleteReport = () => {
  return useApiMutation<void, { id: string }>(
    ({ id }) => `/complaints/${id}`,
    "delete",
    { invalidate: ["reports", "reports_me"] },
  );
};
