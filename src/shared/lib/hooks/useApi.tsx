import { useCallback, useEffect, useReducer, useRef } from "react";
import { axiosInstance } from "../api/axios";
import type { AxiosError, AxiosResponse } from "axios";
import axios from "axios";

type HttpMethod =
  | "get"
  | "post"
  | "put"
  | "patch"
  | "delete"
  | "head"
  | "options";

interface useApiProps {
  path: string;
  method: HttpMethod;
}

type State<TData> = {
  error: AxiosError | null;
  status: "idle" | "loading" | "success" | "error";
  data: TData | null;
};

type Action<TData> =
  | { type: "error"; payload: AxiosError }
  | { type: "loading" }
  | { type: "success"; payload: TData }
  | { type: "reset" };

const reducer = <TData,>(
  state: State<TData>,
  action: Action<TData>,
): State<TData> => {
  switch (action.type) {
    case "error":
      return { ...state, error: action.payload, status: "error" };
    case "loading":
      return { ...state, status: "loading" };
    case "success":
      return { data: action.payload, error: null, status: "success" };
    case "reset":
      return { data: null, error: null, status: "idle" };
    default:
      return state;
  }
};

const initialState = <TData,>(): State<TData> => ({
  data: null,
  error: null,
  status: "idle",
});

export const useApi = <TData = unknown,>({
  path,
  method = "get",
}: useApiProps) => {
  const [state, dispatch] = useReducer(reducer<TData>, undefined, initialState);
  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, []);

  const execute = useCallback(async (): Promise<TData> => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    dispatch({ type: "loading" });

    try {
      const response: AxiosResponse<TData> = await axiosInstance({
        method: method,
        url: path,
      });

      if (mountedRef.current) {
        dispatch({ type: "success", payload: response.data });
      }
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        throw error;
      }
      const axError = error as AxiosError;
      if (mountedRef.current) {
        dispatch({ type: "error", payload: axError });
      }
      throw axError;
    }
  }, [path, method]);

  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  return {
    data: state.data,
    error: state.error,
    status: state.status,
    loading: state.status === "loading",
    execute,
    reset,
  };
};
