import styles from "./calendar.module.scss";
import arrow from "@shared/assets/calendar_arrow.webp";
import { days } from "./libs";
import React, { useMemo, useState, useCallback } from "react";
import { buildMonthDays } from "../hooks/utils";
import { 
  addMonths, 
  subMonths, 
  format, 
  startOfMonth, 
  differenceInDays,
  startOfDay,
  format as formatDate
} from "date-fns";
import { ru } from "date-fns/locale";
import { useBookingStore } from "@/shared/store/booking/booking";

export const Calendar = React.memo(() => {
  const [month, setMonth] = useState(() => new Date());

  const bookingType = useBookingStore((state) => state.bookingType);
  const selectedStartDay = useBookingStore((state) => state.selectedStartDay);
  const selectedEndDay = useBookingStore((state) => state.selectedEndDay);
  const setSelectedStartDay = useBookingStore((state) => state.setSelectedStartDay);
  const setSelectedEndDay = useBookingStore((state) => state.setSelectedEndDay);

  const maxRange = bookingType === "WASHING" ? 1 : 3;

  const minMonth = startOfMonth(new Date());
  const maxMonth = addMonths(minMonth, 3);

  const dates = useMemo(() => buildMonthDays(month), [month]);

  const handlePrev = () => {
    const prev = subMonths(month, 1);
    if (prev >= minMonth) setMonth(prev);
  };

  const handleNext = () => {
    const next = addMonths(month, 1);
    if (next <= maxMonth) setMonth(next);
  };

  const getDateString = useCallback((date: Date): string => {
    return formatDate(startOfDay(date), 'yyyy-MM-dd');
  }, []);

  const isSelected = useCallback((date: Date): boolean => {
    if (!selectedStartDay) return false;
    
    const dateStr = getDateString(date);
    return dateStr === selectedStartDay || dateStr === selectedEndDay;
  }, [selectedStartDay, selectedEndDay, getDateString]);

  const handleDayClick = useCallback((date: Date) => {
    const dateStr = getDateString(date);
    
    if (!selectedStartDay) {
      setSelectedStartDay(dateStr);
    } 
    else if (!selectedEndDay) {
      const start = new Date(selectedStartDay);
      const clicked = new Date(dateStr);
      
      const diffDays = Math.abs(differenceInDays(clicked, start)) + 1;
      
      if (diffDays > maxRange) {
        setSelectedStartDay(dateStr);
        setSelectedEndDay('');
      } else {
        setSelectedEndDay(dateStr);
      }
    }

    else {
      setSelectedStartDay(dateStr);
      setSelectedEndDay('');
    }
  }, [selectedStartDay, selectedEndDay, maxRange, setSelectedStartDay, setSelectedEndDay, getDateString]);

  return (
    <div className={styles.container}>
      <div className={styles.containerTitle}>
        <img
          src={arrow}
          style={{ transform: "rotate(180deg)" }}
          className={styles.containerTitleArrow}
          onClick={handlePrev}
          alt="Предыдущий месяц"
        />
        <span className={styles.containerTitleText}>
          {format(month, "LLLL yyyy", { locale: ru })}
        </span>
        <img
          src={arrow}
          className={styles.containerTitleArrow}
          onClick={handleNext}
          alt="Следующий месяц"
        />
      </div>

      <div className={styles.containerBody}>
        <div className={styles.containerBodyDays}>
          {days.map((el) => (
            <span key={el} className={styles.containerBodyDaysDay}>
              {el}
            </span>
          ))}
        </div>

        <div className={styles.containerBodyValues}>
          {dates.map((el) => (
            <button
              key={getDateString(el.date)}
              className={`${styles.containerBodyValuesButton} ${
                isSelected(el.date) ? styles.selected : ""
              }`}
              type="button"
              onClick={() => handleDayClick(el.date)}
              disabled={el.isEnded}
            >
              {el.date.getDate()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});