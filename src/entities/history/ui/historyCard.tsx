import type { HistoryCardProps } from "../types";
import styles from "./historyCard.module.scss";
import dry from "@shared/assets/dry2.webp";
import wash from "@shared/assets/wash2.webp";

const formatDateTime = (dateTimeString: string): string => {
  const regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):/;
  const match = dateTimeString.match(regex);

  if (!match) {
    return dateTimeString;
  }

  const [, year, month, day, hours, minutes] = match;

  return `${day}.${month}.${year} ${hours}:${minutes}`;
};

export const HistoryCard = ({
  type,
  starts_at,
  ends_at,
  floor,
  slot_places,
}: HistoryCardProps) => {
  const title = `${type !== "DRYING" ? "Стиральная машина" : "Сушильная комната"}, №${slot_places}, ${floor} этаж`;
  const formattedStartsAt = formatDateTime(starts_at);
  const formattedEndsAt = formatDateTime(ends_at);
  const subtitle = `${formattedStartsAt} - ${formattedEndsAt}`;

  return (
    <div className={styles.container}>
      <img
        src={type === "WASHING" ? wash : dry}
        className={styles.containerIcon}
        alt="icon"
      />
      <div className={styles.containerText}>
        <span className={`${styles.containerTextTitle}`}>{title}</span>
        {subtitle}
      </div>
    </div>
  );
};
