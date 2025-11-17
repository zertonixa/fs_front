import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";

type HttpMethod = "post" | "put" | "patch" | "delete";

export function useApiMutation<TData = unknown, TVars = unknown>(
  path: string,
  method: Extract<HttpMethod, "post" | "put" | "patch" | "delete"> = "post",
  invalidate?: unknown[],
) {
  const qc = useQueryClient();
  return useMutation<TData, unknown, TVars>({
    mutationFn: async (vars) => {
      const res = await axiosInstance.request<TData>({
        url: path,
        method,
        data: vars,
      });
      return res.data;
    },
    onSuccess: () =>
      invalidate && qc.invalidateQueries({ queryKey: invalidate }),
  });
}
