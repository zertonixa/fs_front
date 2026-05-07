// @vitest-environment jsdom
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { click, render, waitFor } from "../helpers/render";
import { Logout } from "@/features/logout/ui";

const logoutMock = vi.hoisted(() => ({
  mutate: vi.fn(),
}));

vi.mock("@/features/logout/api", () => ({
  useLogout: () => ({
    mutate: logoutMock.mutate,
    isPending: false,
  }),
}));

describe("logout and navigation flow", () => {
  beforeEach(() => {
    logoutMock.mutate.mockReset();
  });

  it("Logout вызывает мутацию выхода и переводит пользователя на страницу логина", async () => {
    logoutMock.mutate.mockImplementation((_payload, options) => {
      options?.onSuccess?.();
    });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Logout />} />
          <Route path="/login" element={<span>login-page</span>} />
        </Routes>
      </MemoryRouter>,
    );

    click(document.querySelector("button")!);

    await waitFor(() => {
      expect(document.body.textContent).toContain("login-page");
    });

    expect(logoutMock.mutate).toHaveBeenCalledWith(
      {},
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
  });
});
