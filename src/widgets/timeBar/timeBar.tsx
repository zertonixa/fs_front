import { TimeBar } from "@/entities/timeBar/ui";
import styles from "./timeBar.module.scss";
import type { TimeBarProps } from "@/entities/timeBar/ui/types";
import { useBookingParams } from "@/features/hooks/useParams";
import React, { useState } from "react";

export const timeBarMocks: TimeBarProps[] = [
  {
    date: "2025-11-16T09:00:00",
    values: [
      "2025-11-16T13:30:00",
      "2025-11-16T14:00:00",
      "2025-11-16T14:30:00",
      "2025-11-16T15:00:00",
      "2025-11-16T16:00:00",
      "2025-11-16T16:30:00",
      "2025-11-16T17:00:00",
      "2025-11-16T21:00:00",
      "2025-11-16T21:10:00",
      "2025-11-16T21:20:00",
      "2025-11-16T21:30:00",
      "2025-11-16T21:40:00",
    ],
    onValueChanged: () => {},
    type: "startTime",
  },
  {
    date: "2025-11-16T13:30:00",
    values: [
      "2025-11-16T13:30:00",
      "2025-11-16T14:00:00",
      "2025-11-16T14:30:00",
      "2025-11-16T15:00:00",
      "2025-11-16T16:00:00",
      "2025-11-16T16:30:00",
      "2025-11-16T17:00:00",
      "2025-11-16T21:00:00",
      "2025-11-16T21:10:00",
      "2025-11-16T21:20:00",
      "2025-11-16T21:30:00",
      "2025-11-16T21:40:00",
    ],
    onValueChanged: () => {},
    type: "startTime",
  },
  {
    date: "2025-11-16T16:00:00",
    values: [
      "2025-11-16T16:00:00",
      "2025-11-16T16:30:00",
      "2025-11-16T17:00:00",
    ],
    onValueChanged: () => {},
    type: "endTime",
  },
  {
    date: "2025-11-16T18:45:00",
    values: [
      "18:45:00",
      "19:00:00",
      "2025-11-16T19:15:00",
      "2025-11-16T19:30:00",
    ],
    onValueChanged: () => {},
    type: "endTime",
  },
  {
    date: "2025-11-16T21:10:00",
    values: [
      "2025-11-16T21:00:00",
      "2025-11-16T21:10:00",
      "2025-11-16T21:20:00",
      "2025-11-16T21:30:00",
      "2025-11-16T21:40:00",
    ],
    onValueChanged: () => {},
    type: "endTime",
  },
];

export const TimeBarWidget = React.memo(() => {
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);

  const { setTime } = useBookingParams();

  const handleClick = (date: string, param: "startTime" | "endTime") => {
    if (param === "startTime") {
      setStartTime(date);
      setTime({ startTime: date });
    } else {
      setEndTime(date);
      setTime({ endTime: date });
    }
  };

  return (
    <div className={styles.container}>
      <span className={styles.containerTitle}>Начало: 6 октября</span>
      <TimeBar
        type="startTime"
        date={startTime ? startTime : undefined}
        values={timeBarMocks[0].values}
        onValueChanged={handleClick}
      />
      <span className={styles.containerTitle}>Конец: 7 октября</span>
      <TimeBar
        type="endTime"
        date={endTime ? endTime : undefined}
        values={timeBarMocks[1].values}
        onValueChanged={handleClick}
      />
    </div>
  );
});
