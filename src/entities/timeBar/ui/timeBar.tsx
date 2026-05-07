import { useMemo, useState } from "react";
import styles from "./timeBar.module.scss";
import type { TimeBarProps } from "./types";

export const TimeBar = ({
  date,
  values,
  onValueChanged,
  type,
}: TimeBarProps) => {
  const [visible, setVisible] = useState(false);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);

  const slots = useMemo(
    () =>
      values.map((v) => new Date(v)).filter((d) => !Number.isNaN(d.getTime())),
    [values],
  );

  const hours = useMemo(
    () =>
      Array.from(new Set(slots.map((d) => d.getHours()))).sort((a, b) => a - b),
    [slots],
  );

  const minuteSlots = useMemo(
    () =>
      selectedHour === null
        ? []
        : slots.filter((d) => d.getHours() === selectedHour),
    [slots, selectedHour],
  );

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

  const handleSelect = (value: Date, e: React.MouseEvent) => {
    e.stopPropagation();
    setVisible(false);
    onValueChanged(value.toISOString(), type);
  };

  const handleHourClick = (hour: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedHour(hour);
  };

  return (
    <div
      className={styles.container}
      onClick={() => setVisible((prev) => !prev)}
    >
      <div className={styles.containerCard}>
        {date ? formatTime(new Date(date)) : "..."}
      </div>

      {visible && (
        <div
          className={styles.containerPopover}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.containerPopoverHours}>
            {hours.map((h) => (
              <button
                key={h}
                className={`${styles.containerPopoverHoursChip} ${
                  selectedHour === h ? styles.active : ""
                }`}
                onClick={(e) => handleHourClick(h, e)}
              >
                {h.toString().padStart(2, "0")}
              </button>
            ))}
          </div>

          <div className={styles.containerPopoverMinutes}>
            {minuteSlots.map((d) => (
              <button
                key={d.toISOString()}
                className={styles.containerPopoverMinutesItem}
                onClick={(e) => handleSelect(d, e)}
              >
                {formatTime(d)}
              </button>
            ))}

            {!minuteSlots.length && (
              <div className={styles.emptyText}>выберите час</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};