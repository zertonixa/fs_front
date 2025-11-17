import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";
type UseApiQueryArgs<TData> = {
  key: unknown[];
  path: string;
  method?: Extract<HttpMethod, "get">;
  params?: Record<string, unknown>;
  enabled?: boolean;
} & Pick<UseQueryOptions<TData>, "staleTime" | "select" | "gcTime">;

export function useApiQuery<TData = unknown>({
  key,
  path,
  params,
  method = "get",
  enabled = true,
  ...opts
}: UseApiQueryArgs<TData>) {
  return useQuery<TData>({
    queryKey: [...key, params],
    queryFn: async ({ signal }) => {
      const res = await axiosInstance.request<TData>({
        url: path,
        method,
        params,
        signal,
      });
      return res.data;
    },
    enabled,
    ...opts,
  });
}
