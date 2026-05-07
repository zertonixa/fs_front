// @vitest-environment jsdom
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, click } from "../helpers/render";
import { Booking } from "@/widgets/booking/booking";

const mocks = vi.hoisted(() => ({
  useUserBookings: vi.fn(),
  useCancelBooking: vi.fn(),
}));

vi.mock("@/entities/booking/hooks", () => ({ useUserBookings: mocks.useUserBookings }));
vi.mock("@/features/cancelBooking/ui/cancelBooking", () => ({
  CancelBooking: ({ bookingIds }: { bookingIds: string[] }) => (
    <div data-testid="cancel-booking">selected:{bookingIds.join(",")}</div>
  ),
}));

describe("Booking widget", () => {
  beforeEach(() => {
    mocks.useUserBookings.mockReset();
  });

  it("показывает загрузку", () => {
    mocks.useUserBookings.mockReturnValue({ isLoading: true, data: undefined });

    const { container } = render(<Booking />);

    expect(container.querySelector("div")).not.toBeNull();
  });

  it("показывает пустое состояние", () => {
    mocks.useUserBookings.mockReturnValue({ isLoading: false, data: [] });

    render(<Booking />);

    expect(document.body.textContent).toContain("Ваши брони");
    expect(document.body.textContent).toContain("Броней нет");
  });

  it("рендерит брони и передает выбранные id в CancelBooking", () => {
    mocks.useUserBookings.mockReturnValue({
      isLoading: false,
      data: [
        {
          id: "booking-1",
          type: "WASHING",
          floor: 2,
          slot_places: [1],
          starts_at: "2026-04-24T10:00:00.000Z",
          ends_at: "2026-04-24T11:00:00.000Z",
        },
        {
          id: "booking-2",
          type: "DRYING",
          floor: 3,
          slot_places: [5],
          starts_at: "2026-04-25T10:00:00.000Z",
          ends_at: "2026-04-25T11:00:00.000Z",
        },
      ],
    });

    render(<Booking />);

    expect(document.body.textContent).toContain("Стиральная машина, №1, 2 этаж");
    expect(document.body.textContent).toContain("Сушильная комната, №5, 3 этаж");
    expect(document.body.textContent).toContain("selected:");

    const firstCard = document.querySelector('img[alt="icon"]')!.parentElement!;
    click(firstCard);

    expect(document.body.textContent).toContain("selected:booking-1");
  });
});
