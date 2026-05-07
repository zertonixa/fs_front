// @vitest-environment jsdom
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "../helpers/render";
import { Header } from "@/widgets/header";

const authState = vi.hoisted(() => ({
  me: undefined as
    | undefined
    | {
        username: string;
        telegram_id: number;
        id: string;
        is_admin: boolean;
        is_root_admin: boolean;
      },
}));

vi.mock("@/shared/lib/hooks/useApiQuery", () => ({
  useApiQuery: vi.fn(() => ({
    data: authState.me,
    isLoading: false,
    isError: false,
  })),
}));

vi.mock("@features/selectCso/selectCso", () => ({
  SelectCso: () => <div data-testid="select-cso">select-cso</div>,
}));

vi.mock("@/features/logout/ui", () => ({
  Logout: () => <button type="button">logout</button>,
}));

vi.mock("@/widgets/reportPopup", () => ({
  Report: () => <button type="button">report</button>,
}));

describe("auth and role-based interface behavior", () => {
  beforeEach(() => {
    authState.me = undefined;
  });

  it("Header скрывает ссылку в админку для обычного пользователя", () => {
    authState.me = {
      id: "user-1",
      username: "user",
      telegram_id: 1,
      is_admin: false,
      is_root_admin: false,
    };

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Header title="Главная" />
      </MemoryRouter>,
    );

    expect(document.body.textContent).toContain("Главная");
    expect(document.querySelector('a[href="/admin"]')).toBeNull();
  });

  it("Header показывает ссылку в админку для администратора", () => {
    authState.me = {
      id: "admin-1",
      username: "admin",
      telegram_id: 2,
      is_admin: true,
      is_root_admin: false,
    };

    render(
      <MemoryRouter initialEntries={["/booking"]}>
        <Header title="Бронирование" />
      </MemoryRouter>,
    );

    expect(document.body.textContent).toContain("Бронирование");
    expect(document.querySelector('a[href="/admin"]')).not.toBeNull();
  });
});
