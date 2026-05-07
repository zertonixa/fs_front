// @vitest-environment jsdom
import React from "react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, click } from "../helpers/render";
import { useUserBookings } from "@/entities/booking/hooks";
import {
  useBookingParams,
  useChangeSlot,
  useOverlaps,
  useSlots,
} from "@/entities/bookingSlots/hooks/hooks";

const spies = vi.hoisted(() => ({
  useApiQuery: vi.fn(),
  useApiMutation: vi.fn(),
}));

vi.mock("@/shared/lib/hooks/useApiQuery", () => ({
  useApiQuery: spies.useApiQuery,
}));
vi.mock("@shared/lib/hooks/useApiQuery", () => ({
  useApiQuery: spies.useApiQuery,
}));
vi.mock("@/shared/lib/hooks/useApiMutation", () => ({
  useApiMutation: spies.useApiMutation,
}));
vi.mock("@shared/lib/hooks/useApiMutation", () => ({
  useApiMutation: spies.useApiMutation,
}));

describe("booking hooks", () => {
  beforeEach(() => {
    spies.useApiQuery.mockReset().mockReturnValue({ data: [] });
    spies.useApiMutation
      .mockReset()
      .mockImplementation((path, method) => ({
        path,
        method,
        mutate: vi.fn(),
      }));
  });

  it("useUserBookings запрашивает брони текущего пользователя", () => {
    function Probe() {
      useUserBookings();
      return null;
    }

    render(<Probe />);

    expect(spies.useApiQuery).toHaveBeenCalledWith({
      key: ["user-bookings"],
      path: "/bookings/me",
    });
  });

  it("useSlots передает фильтры type, floor и cso в query params", () => {
    function Probe() {
      useSlots({ type: "WASHING", floor: 2, cso: 4 });
      return null;
    }

    render(<Probe />);

    expect(spies.useApiQuery).toHaveBeenCalledWith({
      key: ["slots", 4],
      path: "/slots",
      params: { type: "WASHING", floor_: 2, cso_: 4 },
    });
  });

  it("useOverlaps прокидывает enabled и даты в запрос пересечений", () => {
    const startsAt = new Date("2026-04-24T10:00:00.000Z");
    const endsAt = new Date("2026-04-24T11:00:00.000Z");

    function Probe() {
      useOverlaps({
        type: "DRYING",
        floor: 3,
        cso: 1,
        starts_at: startsAt,
        ends_at: endsAt,
        enabled: false,
      });
      return null;
    }

    render(<Probe />);

    expect(spies.useApiQuery).toHaveBeenCalledWith({
      key: ["slots-overlaps"],
      path: "/bookings/overlaps",
      params: {
        type: "DRYING",
        floor: 3,
        cso: 1,
        starts_at: startsAt,
        ends_at: endsAt,
      },
      enabled: false,
    });
  });

  it("useChangeSlot собирает три мутации для создания, удаления и переключения статуса слота", () => {
    function Probe() {
      useChangeSlot();
      return null;
    }

    render(<Probe />);

    expect(spies.useApiMutation).toHaveBeenNthCalledWith(1, "/slots", "post", {
      invalidate: ["slots"],
    });
    expect(spies.useApiMutation).toHaveBeenNthCalledWith(
      2,
      expect.any(Function),
      "delete",
      { invalidate: ["slots"] },
    );
    expect(spies.useApiMutation).toHaveBeenNthCalledWith(
      3,
      expect.any(Function),
      "patch",
      { invalidate: ["slots"] },
    );

    const deletePath = spies.useApiMutation.mock.calls[1][0] as (vars: {
      id: string;
    }) => string;
    const togglePath = spies.useApiMutation.mock.calls[2][0] as (vars: {
      id: string;
    }) => string;

    expect(deletePath({ id: "slot-7" })).toBe("/slots/slot-7");
    expect(togglePath({ id: "slot-7" })).toBe("/slots/slot-7/toggle-status");
  });
});

describe("useBookingParams", () => {
  function SearchProbe() {
    const { selectedPlaces, togglePlace } = useBookingParams();
    const location = useLocation();

    return (
      <div>
        <span data-testid="places">{selectedPlaces.join("|")}</span>
        <span data-testid="search">{location.search}</span>
        <button type="button" onClick={() => togglePlace(1)}>
          toggle 1
        </button>
        <button type="button" onClick={() => togglePlace(7)}>
          toggle 7
        </button>
      </div>
    );
  }

  it("добавляет и удаляет место из query string", () => {
    render(
      <MemoryRouter initialEntries={["/booking?places=2,3"]}>
        <SearchProbe />
      </MemoryRouter>,
    );

    expect(document.querySelector('[data-testid="places"]')?.textContent).toBe(
      "2|3",
    );

    click(document.querySelector("button")!);
    expect(document.querySelector('[data-testid="places"]')?.textContent).toBe(
      "2|3|1",
    );
    expect(
      document.querySelector('[data-testid="search"]')?.textContent,
    ).toContain("places=2%2C3%2C1");

    click(document.querySelector("button")!);
    expect(document.querySelector('[data-testid="places"]')?.textContent).toBe(
      "2|3",
    );
  });

  it("не позволяет выбрать больше шести мест", () => {
    render(
      <MemoryRouter initialEntries={["/booking?places=1,2,3,4,5,6"]}>
        <SearchProbe />
      </MemoryRouter>,
    );

    click(document.querySelectorAll("button")[1]);

    expect(document.querySelector('[data-testid="places"]')?.textContent).toBe(
      "1|2|3|4|5|6",
    );
  });
});
