// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, click, mouseDown, byExactText } from "../helpers/render";
import { Button } from "@/shared/ui/button";
import { CustomSelect } from "@/shared/ui/select/select";
import { Options } from "@/entities/options";
import { BookingSlot } from "@/entities/bookingSlots/ui";
import { UserCard } from "@/entities/adminUsers/ui/userCard";
import { BookingCard } from "@/entities/booking/ui/bookingCard";
import { TimeBar } from "@/entities/timeBar/ui";

describe("basic ui components", () => {
  it("Button вызывает onClick и блокируется через disabled", () => {
    const onClick = vi.fn();
    const { rerender } = render(<Button text="Сохранить" onClick={onClick} />);

    click(document.querySelector("button")!);
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(<Button text="Сохранить" onClick={onClick} disabled />);
    click(document.querySelector("button")!);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("CustomSelect открывает меню, выбирает значение и закрывается по клику снаружи", () => {
    const onChange = vi.fn();
    render(
      <div>
        <CustomSelect
          value="one"
          onChange={onChange}
          options={[
            { value: "one", label: "Первый" },
            { value: "two", label: "Второй" },
          ]}
        />
        <button type="button" id="outside">outside</button>
      </div>,
    );

    click(document.querySelector("button")!);
    expect(document.body.textContent).toContain("Второй");

    click(Array.from(document.querySelectorAll("button")).find((button) => button.textContent?.includes("Второй"))!);
    expect(onChange).toHaveBeenCalledWith("two");
    expect(document.body.textContent).not.toContain("Второй▾");

    click(document.querySelector("button")!);
    mouseDown(document.getElementById("outside")!);
    expect(document.body.textContent).not.toContain("Второй");
  });

  it("Options показывает варианты и возвращает выбранный номер ЦСО", () => {
    const onValueChanged = vi.fn();
    render(<Options values={[1, 3]} selected={4} onValueChanged={onValueChanged} />);

    expect(document.body.textContent).toContain("ЦСО №4");
    click(byExactText("ЦСО №4"));
    expect(document.body.textContent).toContain("ЦСО №1");

    const option = Array.from(document.querySelectorAll("div")).find((node) => node.textContent === "ЦСО №3")!;
    click(option);

    expect(onValueChanged).toHaveBeenCalledWith(3);
  });

  it("BookingSlot вызывает onClick, поддерживает disabled и режим входа", () => {
    const onClick = vi.fn();
    const { rerender, container } = render(
      <BookingSlot place={2} isSelected={false} isDisabled={false} isEnter={false} onClick={onClick} />,
    );

    click(document.querySelector("button")!);
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(<BookingSlot place={2} isSelected isDisabled isEnter={false} onClick={onClick} />);
    expect(document.querySelector("button")?.disabled).toBe(true);

    rerender(<BookingSlot place={2} isSelected={false} isDisabled={false} isEnter onClick={onClick} />);
    expect(container.querySelector("img")).not.toBeNull();
  });

  it("UserCard отображает статус, переключает админа и выбирает нужное действие бана", () => {
    const onToggleAdmin = vi.fn();
    const onBan = vi.fn();
    const onUnBan = vi.fn();

    const { rerender } = render(
      <UserCard
        id="user-1"
        username="ivan"
        status={false}
        is_admin={false}
        canChangeAdmin
        onToggleAdmin={onToggleAdmin}
        onBan={onBan}
        onUnBan={onUnBan}
      />,
    );

    expect(document.body.textContent).toContain("Статус: Активен");
    click(document.querySelector('[aria-label="Переключить роль администратора"]')!);
    expect(onToggleAdmin).toHaveBeenCalledTimes(1);

    click(Array.from(document.querySelectorAll("button")).find((button) => button.textContent === "Забанить")!);
    expect(onBan).toHaveBeenCalledTimes(1);

    rerender(
      <UserCard
        id="user-1"
        username="ivan"
        status
        is_admin={false}
        canChangeAdmin
        onToggleAdmin={onToggleAdmin}
        onBan={onBan}
        onUnBan={onUnBan}
      />,
    );

    expect(document.body.textContent).toContain("Статус: Заблокирован");
    click(Array.from(document.querySelectorAll("button")).find((button) => button.textContent === "Разбанить")!);
    expect(onUnBan).toHaveBeenCalledTimes(1);
  });

  it("UserCard ограничивает ролевые действия для пользователя без root-прав", () => {
    const onToggleAdmin = vi.fn();
    const onBan = vi.fn();
    const onUnBan = vi.fn();

    render(
      <UserCard
        id="admin-1"
        username="rootless"
        status={false}
        is_admin
        canChangeAdmin={false}
        onToggleAdmin={onToggleAdmin}
        onBan={onBan}
        onUnBan={onUnBan}
      />,
    );

    const adminToggle = document.querySelector<HTMLButtonElement>('[aria-label="Переключить роль администратора"]')!;
    const banButton = Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find((button) =>
      button.textContent?.includes("Забанить"),
    )!;

    expect(adminToggle.disabled).toBe(true);
    expect(banButton.disabled).toBe(true);

    click(adminToggle);
    click(banButton);

    expect(onToggleAdmin).not.toHaveBeenCalled();
    expect(onBan).not.toHaveBeenCalled();
    expect(onUnBan).not.toHaveBeenCalled();
  });


  it("BookingCard форматирует бронь и передает id при клике", () => {
    const onClick = vi.fn();

    render(
      <BookingCard
        id="booking-42"
        type="WASHING"
        floor={5}
        place={[1, 2]}
        startsAt="2026-04-24T10:00:00.000Z"
        endsAt="2026-04-24T11:00:00.000Z"
        isActive
        onClick={onClick}
      />,
    );

    expect(document.body.textContent).toContain("Стиральная машина, №1,2, 5 этаж");
    expect(document.querySelector('img[alt="accept"]')).not.toBeNull();

    click(document.querySelector('img[alt="icon"]')!.parentElement!);
    expect(onClick).toHaveBeenCalledWith("booking-42");
  });

  it("TimeBar сначала показывает часы, затем минуты и возвращает ISO выбранного времени", () => {
    const onValueChanged = vi.fn();
    render(
      <TimeBar
        type="startTime"
        values={[
          "2026-04-24T08:00:00.000Z",
          "2026-04-24T08:30:00.000Z",
          "2026-04-24T09:00:00.000Z",
        ]}
        onValueChanged={onValueChanged}
      />,
    );

    click(byExactText("..."));
    expect(document.body.textContent).toContain("11");

    click(Array.from(document.querySelectorAll("button")).find((button) => button.textContent?.includes("11"))!);
    const minuteButton = Array.from(document.querySelectorAll("button")).find((button) => button.textContent?.includes("30"))!;
    click(minuteButton);

    expect(onValueChanged).toHaveBeenCalledWith("2026-04-24T08:30:00.000Z", "startTime");
  });
});
