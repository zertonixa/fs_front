import styles from "./calendar.module.scss";
import arrow from "@shared/assets/calendar_arrow.webp";
import { days } from "./libs";
import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { buildMonthDays } from "../hooks/utils";
import { addMonths, subMonths, format, startOfMonth } from "date-fns";
import { ru } from "date-fns/locale";
import { useBookingRange } from "../hooks/hooks";

export const Calendar = React.memo(() => {
  const [month, setMonth] = useState(() => new Date());
  const { handleDayClick, isSelected } = useBookingRange();

  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  const maxRange = type === "WASHING" ? 1 : type === "DRYING" ? 3 : null;

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

  return (
    <div className={styles.container}>
      <div className={styles.containerTitle}>
        <img
          src={arrow}
          style={{ transform: "rotate(180deg)" }}
          className={styles.containerTitleArrow}
          onClick={handlePrev}
        />
        <span className={styles.containerTitleText}>
          {format(month, "LLLL yyyy", { locale: ru })}
        </span>
        <img
          src={arrow}
          className={styles.containerTitleArrow}
          onClick={handleNext}
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
              key={el.date.toISOString()}
              className={`${styles.containerBodyValuesButton} ${
                isSelected(el.date) ? styles.selected : ""
              }`}
              type="button"
              onClick={() => handleDayClick(el.date, maxRange)}
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
