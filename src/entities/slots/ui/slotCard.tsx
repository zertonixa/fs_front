import { formatDateMSK } from "@/shared/helpres/formatTime";
import styles from "./slotCard.module.scss";
import type { SlotCardProps } from "./types";
import arrow from "@shared/assets/right-arrow.svg";

export const SlotCard = ({
  type,
  floor,
  place,
  startsAt,
  onClick,
}: SlotCardProps) => {
  const title = `${type === "WASHING" ? "Стиральная машина" : "Сушильная комната"}, №${place}, ${floor} этаж`;
  const subtitle = startsAt;

  return (
    <div className={styles.container}>
      <div className={styles.containerText}>
        <span className={`${styles.containerTextTitle}`}>{title}</span>
        {formatDateMSK(subtitle)}
      </div>
      <button
        type="button"
        onClick={() => onClick()}
        className={styles.containerButton}
      >
        <img
          src={arrow}
          alt="redirect"
          className={styles.containerButtonImage}
        />
      </button>
    </div>
  );
};
