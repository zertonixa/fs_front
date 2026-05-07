// @vitest-environment jsdom
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, click } from "../helpers/render";
import { Calendar } from "@/entities/calendar/ui";
import { useBookingStore } from "@/shared/store/booking/booking";

describe("Calendar component", () => {
  beforeEach(() => {
    vi.setSystemTime(new Date("2026-04-24T12:00:00.000Z"));
    useBookingStore.setState({
      bookingType: "WASHING",
      selectedStartDay: "",
      selectedEndDay: "",
      selectedStartTime: undefined,
      selectedEndTime: undefined,
      selectedSlotIds: [],
      cso: 4,
      floor: 1,
    });
  });

  it("рендерит текущий месяц, дни недели и выбирает день", () => {
    render(<Calendar />);

    expect(document.body.textContent?.toLowerCase()).toContain("апрель 2026");
    for (const dayName of ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]) {
      expect(document.body.textContent).toContain(dayName);
    }

    const day24 = Array.from(document.querySelectorAll("button")).find((button) => button.textContent === "24")!;
    click(day24);

    expect(useBookingStore.getState().selectedStartDay).toBe("2026-04-24");
  });

  it("переключается на следующий месяц, но не уходит в прошлый до текущего", () => {
    render(<Calendar />);

    const [prev, next] = Array.from(document.querySelectorAll("img"));

    click(prev);
    expect(document.body.textContent?.toLowerCase()).toContain("апрель 2026");

    click(next);
    expect(document.body.textContent?.toLowerCase()).toContain("май 2026");
  });
});
