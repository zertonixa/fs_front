import { TimeBar } from "@/entities/timeBar/ui";
import styles from "./timeBar.module.scss";
import React, { useMemo } from "react";
import { useAvailableStarts, useAvailableEnds } from "@/entities/timeBar/hooks/hooks";
import { useBookingStore } from "@/shared/store/booking/booking";

export const TimeBarWidget = React.memo(() => {

  const bookingType = useBookingStore((state) => state.bookingType);
  const floor = useBookingStore((state) => state.floor);
  const cso = useBookingStore((state) => state.cso);
  const selectedStartDay = useBookingStore((state) => state.selectedStartDay);
  const selectedEndDay = useBookingStore((state) => state.selectedEndDay);
  const selectedStartTime = useBookingStore((state) => state.selectedStartTime);
  const selectedEndTime = useBookingStore((state) => state.selectedEndTime);
  
  const setSelectedStartTime = useBookingStore((state) => state.setSelectedStartTime);
  const setSelectedEndTime = useBookingStore((state) => state.setSelectedEndTime);

  const baseDate = useMemo(() => {
    if (selectedStartDay) {
      const [year, month, day] = selectedStartDay.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    return new Date();
  }, [selectedStartDay]);

  const endBaseDate = useMemo(() => {
    if (selectedStartDay) {
      const [year, month, day] = selectedStartDay.split('-').map(Number);
      const date = new Date(year, month - 1, day, 23, 59, 0);
      return date;
    }
    setSelectedEndTime("");
    return undefined;
  }, [selectedStartDay]);

  const endDateForSearch = useMemo(() => {
    if (selectedEndDay) {
      const [year, month, day] = selectedEndDay.split('-').map(Number);
      const date = new Date(year, month - 1, day, 23, 59, 0);
      return date;
    }
    setSelectedEndTime("");
    return undefined;
  }, [selectedEndDay]);

  const startsQuery = useAvailableStarts(floor, cso, bookingType, baseDate);

  const endsQuery = useAvailableEnds(
    floor,
    cso,
    bookingType,
    selectedStartTime || baseDate.toISOString(),
    endDateForSearch?.toISOString() || endBaseDate?.toISOString()
  );

  const handleStartTimeSelect = (dateString: string) => {
    setSelectedStartTime(dateString);
  };

  const handleEndTimeSelect = (dateString: string) => {
    setSelectedEndTime(dateString);
  };

  const formatDateDisplay = (date: Date): string => {
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long"
    });
  };

  return (
    <div className={styles.container}>
      <span className={styles.containerTitle}>
        Начало: {formatDateDisplay(baseDate)}
      </span>
      <TimeBar
        type="startTime"
        date={selectedStartTime ? selectedStartTime : undefined}
        values={startsQuery.data || []}
        onValueChanged={handleStartTimeSelect}
      />
      
      <span className={styles.containerTitle}>
        Конец: {formatDateDisplay(
          selectedEndTime 
            ? new Date(selectedEndTime)
            : new Date(baseDate.getTime() + 24 * 60 * 60 * 1000)
        )}
      </span>
      <TimeBar
        type="endTime"
        date={selectedEndTime ? selectedEndTime : undefined}
        values={endsQuery.data || []}
        onValueChanged={handleEndTimeSelect}
      />
    </div>
  );
});