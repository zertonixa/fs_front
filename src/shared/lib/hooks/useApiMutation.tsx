import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { axiosInstance } from "../api/axios";

type HttpMethod = "post" | "put" | "patch" | "delete";
type PathResolver<TVars> = string | ((vars: TVars) => string);

export type ApiError = {
  detail?: string;
  message?: string;
  errors?: unknown;
};

export function useApiMutation<
  TData = unknown,
  TVars = unknown,
  TError = AxiosError<ApiError>,
>(
  path: PathResolver<TVars>,
  method: HttpMethod = "post",
  options?: {
    invalidate?: unknown[];
    onSuccess?: (data: TData, variables: TVars, context?: unknown) => void;
    onError?: (error: TError, variables: TVars, context?: unknown) => void;
    onSettled?: (
      data: TData | undefined,
      error: TError | null,
      variables: TVars,
      context?: unknown,
    ) => void;
  },
) {
  const qc = useQueryClient();

  const mutationOptions: UseMutationOptions<TData, TError, TVars> = {
    mutationFn: async (vars) => {
      const url = typeof path === "function" ? path(vars) : path;

      const res = await axiosInstance.request<TData>({
        url,
        method,
        ...(vars !== undefined && vars !== null ? { data: vars } : {}),
      });

      return res.data;
    },
    ...options,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);

      if (options?.invalidate) {
        qc.invalidateQueries({ queryKey: options.invalidate });
      }
    },
  };

  return useMutation<TData, TError, TVars>(mutationOptions);
}
