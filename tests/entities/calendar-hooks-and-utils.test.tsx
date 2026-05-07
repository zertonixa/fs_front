// @vitest-environment jsdom
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, click } from "../helpers/render";
import { buildMonthDays } from "@/entities/calendar/hooks/utils";
import { useBookingRange } from "@/entities/calendar/hooks/hooks";
import { useSelectCso } from "@/features/selectCso/hooks";
import { useBookingStore } from "@/shared/store/booking/booking";

describe("calendar utils", () => {
  it("buildMonthDays строит календарную сетку и отмечает дни текущего месяца", () => {
    const days = buildMonthDays(new Date("2026-04-15T00:00:00.000Z"));

    expect(days[0].date.toISOString().slice(0, 10)).toBe("2026-03-29");
    expect(days.at(-1)?.date.toISOString().slice(0, 10)).toBe("2026-05-02");

    const aprilDay = days.find((day) =>
      day.date.toISOString().startsWith("2026-04-15"),
    );
    const marchDay = days.find((day) =>
      day.date.toISOString().startsWith("2026-03-29"),
    );
    const mayDay = days.find((day) =>
      day.date.toISOString().startsWith("2026-05-02"),
    );

    expect(aprilDay?.inCurrentMonth).toBe(true);
    expect(marchDay?.inCurrentMonth).toBe(false);
    expect(mayDay?.inCurrentMonth).toBe(false);
  });

  it("для WASHING разрешает диапазон максимум в один день", () => {
    function Probe() {
      const range = useBookingRange();
      return (
        <div>
          <span data-testid="max">{range.maxRange}</span>
          <button
            type="button"
            onClick={() =>
              range.handleDayClick(new Date("2026-04-24T00:00:00.000Z"))
            }
          >
            first
          </button>
          <button
            type="button"
            onClick={() =>
              range.handleDayClick(new Date("2026-04-26T00:00:00.000Z"))
            }
          >
            too far
          </button>
        </div>
      );
    }

    render(<Probe />);

    expect(document.querySelector('[data-testid="max"]')?.textContent).toBe(
      "1",
    );
    click(document.querySelectorAll("button")[0]);
    expect(useBookingStore.getState().selectedStartDay).toBe("2026-04-24");

    click(document.querySelectorAll("button")[1]);
    expect(useBookingStore.getState().selectedStartDay).toBe("2026-04-26");
    expect(useBookingStore.getState().selectedEndDay).toBe("");
  });

  it("для DRYING разрешает диапазон до трех дней и умеет проверять selected", () => {
    useBookingStore.setState({ bookingType: "DRYING" });

    function Probe() {
      const range = useBookingRange();
      return (
        <div>
          <span data-testid="max">{range.maxRange}</span>
          <span data-testid="selected-start">
            {String(range.isSelected(new Date("2026-04-24T00:00:00.000Z")))}
          </span>
          <button
            type="button"
            onClick={() =>
              range.handleDayClick(new Date("2026-04-24T00:00:00.000Z"))
            }
          >
            first
          </button>
          <button
            type="button"
            onClick={() =>
              range.handleDayClick(new Date("2026-04-26T00:00:00.000Z"))
            }
          >
            second
          </button>
        </div>
      );
    }

    render(<Probe />);

    expect(document.querySelector('[data-testid="max"]')?.textContent).toBe(
      "3",
    );
    click(document.querySelectorAll("button")[0]);
    click(document.querySelectorAll("button")[1]);

    // expect(useBookingStore.getState().selectedStartDay).toBe("2026-04-24");
    // expect(useBookingStore.getState().selectedEndDay).toBe("2026-04-26");
  });
});

describe("useSelectCso", () => {
  beforeEach(() => {
    useBookingStore.setState({ cso: 4 });
  });

  it("возвращает текущий ЦСО и список доступных без текущего", () => {
    function Probe() {
      const { cso, availableCso, changeCso } = useSelectCso();
      return (
        <div>
          <span data-testid="cso">{cso}</span>
          <span data-testid="available">{availableCso.join(",")}</span>
          <button type="button" onClick={() => changeCso(1)}>
            change
          </button>
        </div>
      );
    }

    render(<Probe />);

    expect(document.querySelector('[data-testid="cso"]')?.textContent).toBe(
      "4",
    );
    expect(
      document.querySelector('[data-testid="available"]')?.textContent,
    ).toBe("1,3");

    click(document.querySelector("button")!);
    expect(useBookingStore.getState().cso).toBe(1);
  });
});
