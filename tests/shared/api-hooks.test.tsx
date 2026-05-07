// @vitest-environment jsdom
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, click, flushPromises, waitFor } from "../helpers/render";
import { axiosInstance } from "@/shared/lib/api/axios";
import { useApiMutation } from "@/shared/lib/hooks/useApiMutation";
import { useApiQuery } from "@/shared/lib/hooks/useApiQuery";

vi.mock("@/shared/lib/api/axios", () => ({
  axiosInstance: {
    request: vi.fn(),
  },
}));

const requestMock = vi.mocked(axiosInstance.request);

function createClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function renderWithQueryClient(ui: React.ReactElement) {
  const client = createClient();

  return {
    client,
    ...render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>),
  };
}

describe("shared api hooks", () => {
  beforeEach(() => {
    requestMock.mockReset();
  });

  it("useApiQuery делает GET-запрос и возвращает data", async () => {
    requestMock.mockResolvedValueOnce({ data: { city: "Москва", temp: 21 } });

    function Probe() {
      const query = useApiQuery<{ city: string; temp: number }>({
        key: ["weather"],
        path: "/weather",
        params: { cso: 4 },
      });

      if (query.isLoading) return <span>loading</span>;
      if (query.error) return <span>error</span>;

      return (
        <span>
          {query.data ? `${query.data.city}:${query.data.temp}` : "empty"}
        </span>
      );
    }

    renderWithQueryClient(<Probe />);
    await flushPromises();

    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/weather",
        method: "get",
        params: { cso: 4 },
        signal: expect.any(AbortSignal),
      }),
    );
    await waitFor(() => {
      expect(document.body.textContent).toContain("Москва:21");
    });
  });

  it("useApiQuery не запускает запрос, если enabled=false", async () => {
    function Probe() {
      useApiQuery({ key: ["disabled-query"], path: "/never", enabled: false });
      return <span>ready</span>;
    }

    renderWithQueryClient(<Probe />);
    await flushPromises();

    expect(requestMock).not.toHaveBeenCalled();
  });

  it("useApiQuery отдает ошибку в UI при серверном отказе", async () => {
    requestMock.mockRejectedValueOnce({
      response: { status: 500, data: { detail: "Server error" } },
    });

    function Probe() {
      const query = useApiQuery<{ ok: boolean }>({
        key: ["server-error"],
        path: "/server-error",
      });

      if (query.isLoading) return <span>loading</span>;
      if (query.isError) {
        const status = (query.error as { response?: { status?: number } })
          .response?.status;
        return <span>error:{status}</span>;
      }

      return <span>ok</span>;
    }

    renderWithQueryClient(<Probe />);

    await waitFor(() => {
      expect(document.body.textContent).toContain("error:500");
    });
  });

  it("useApiQuery позволяет обработать 401 как истечение сессии", async () => {
    requestMock.mockRejectedValueOnce({
      response: { status: 401, data: { detail: "Unauthorized" } },
    });

    function Probe() {
      const query = useApiQuery<{ id: string }>({
        key: ["me-expired"],
        path: "/auth/me",
      });

      if (query.isLoading) return <span>loading</span>;

      const status = (query.error as { response?: { status?: number } } | null)
        ?.response?.status;
      if (status === 401) return <span>session-expired</span>;

      return <span>authorized</span>;
    }

    renderWithQueryClient(<Probe />);

    await waitFor(() => {
      expect(document.body.textContent).toContain("session-expired");
    });
  });

  it("useApiMutation отправляет payload, вызывает onSuccess и инвалидирует query", async () => {
    requestMock.mockResolvedValueOnce({ data: { id: "booking-1" } });
    const onSuccess = vi.fn();

    function Probe() {
      const mutation = useApiMutation<{ id: string }, { name: string }>(
        ({ name }) => `/items/${name}`,
        "patch",
        { invalidate: ["items"], onSuccess },
      );

      return (
        <button
          type="button"
          onClick={() => mutation.mutate({ name: "slot-1" })}
        >
          mutate
        </button>
      );
    }

    const { client } = renderWithQueryClient(<Probe />);
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    click(document.querySelector("button")!);
    await flushPromises();

    expect(requestMock).toHaveBeenCalledWith({
      url: "/items/slot-1",
      method: "patch",
      data: { name: "slot-1" },
    });
    expect(onSuccess).toHaveBeenCalledWith(
      { id: "booking-1" },
      { name: "slot-1" },
      undefined,
    );
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["items"] });
  });

  it("useApiMutation вызывает onError при ошибке валидации", async () => {
    const onError = vi.fn();

    requestMock.mockRejectedValueOnce({
      response: { status: 400, data: { detail: "Validation error" } },
    });

    function Probe() {
      const mutation = useApiMutation<unknown, { name: string }>(
        "/items",
        "post",
        { onError },
      );

      return (
        <button type="button" onClick={() => mutation.mutate({ name: "" })}>
          submit
        </button>
      );
    }

    renderWithQueryClient(<Probe />);

    click(document.querySelector("button")!);

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });

    expect(requestMock).toHaveBeenCalledWith({
      url: "/items",
      method: "post",
      data: { name: "" },
    });
  });
});
