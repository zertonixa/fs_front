import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions, QueryKey } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { axiosInstance } from "../api/axios";

export type ApiError = { detail?: string; message?: string; errors?: unknown };

type UseApiQueryArgs<TData, TError> = {
  key: QueryKey;
  path: string;
  params?: Record<string, unknown>;
  enabled?: boolean;
  options?: Omit<
    UseQueryOptions<TData, TError, TData, QueryKey>,
    "queryKey" | "queryFn" | "enabled"
  >;
};

export function useApiQuery<TData = unknown, TError = AxiosError<ApiError>>({
  key,
  path,
  params,
  enabled = true,
  options,
}: UseApiQueryArgs<TData, TError>) {
  return useQuery<TData, TError, TData, QueryKey>({
    queryKey: [...(key as unknown[]), params],
    queryFn: async ({ signal }) => {
      const res = await axiosInstance.request<TData>({
        url: path,
        method: "get",
        params,
        signal,
      });
      return res.data;
    },
    enabled,
    ...options,
  });
}
