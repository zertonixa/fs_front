import { differenceInCalendarDays } from "date-fns";
import { useCallback } from "react";
import { useBookingStore } from "@/shared/store/booking/booking";

export const useBookingRange = () => {
  const {
    bookingType,
    selectedStartDay,
    selectedEndDay,
    setSelectedStartDay,
    setSelectedEndDay,
  } = useBookingStore();

  const maxRange = bookingType === "WASHING" ? 1 : 3;

  // Проверяем, выбран ли день
  const isSelected = useCallback(
    (date: Date): boolean => {
      if (!selectedStartDay) return false;

      const dateStr = date.toISOString().split("T")[0];

      // Если выбран только начальный день
      if (!selectedEndDay) {
        return dateStr === selectedStartDay;
      }

      // Если выбран диапазон
      return dateStr === selectedStartDay || dateStr === selectedEndDay;
    },
    [selectedStartDay, selectedEndDay],
  );

  // Обработка клика по дню
  const handleDayClick = useCallback(
    (date: Date) => {
      const dateStr = date.toISOString().split("T")[0];

      // Если не выбран начальный день, устанавливаем его
      if (!selectedStartDay) {
        setSelectedStartDay(dateStr);
      }
      // Если начальный день выбран, но конечный нет
      else if (!selectedEndDay) {
        const start = new Date(selectedStartDay);
        const clicked = new Date(dateStr);

        // Проверяем диапазон
        const diffDays = Math.abs(differenceInCalendarDays(clicked, start)) + 1;

        if (diffDays > maxRange) {
          // Если превышает диапазон, сбрасываем выбор и начинаем заново
          setSelectedStartDay(dateStr);
          setSelectedEndDay("");
        } else {
          // Устанавливаем конечный день
          setSelectedEndDay(dateStr);
        }
      }
      // Если оба дня выбраны, сбрасываем и выбираем новый начальный
      else {
        setSelectedStartDay(dateStr);
        setSelectedEndDay("");
      }
    },
    [
      selectedStartDay,
      selectedEndDay,
      maxRange,
      setSelectedStartDay,
      setSelectedEndDay,
    ],
  );

  return {
    handleDayClick,
    isSelected,
    maxRange,
  };
};
