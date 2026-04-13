import styles from "./bookingCard.module.scss";
import dry from "@shared/assets/dry2.webp";
import wash from "@shared/assets/wash2.webp";
import accept from "@shared/assets/accept.webp";
import { formatDateMSK } from "@/shared/helpres/formatTime";

interface BookingCardProps {
  type: "WASHING" | "DRYING";
  floor: number;
  id: string;
  place?: number[];
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  onClick: (str: string) => void;
}

export const BookingCard = ({
  type,
  floor,
  place,
  startsAt,
  endsAt,
  id,
  isActive,
  onClick,
}: BookingCardProps) => {
  const title = `${type !== "DRYING" ? "Стиральная машина" : "Сушильная комната"}, №${place}, ${floor} этаж`;
  const formattedStartsAt = formatDateMSK(startsAt);
  const formattedEndsAt = formatDateMSK(endsAt);
  const subtitle = `${formattedStartsAt} - ${formattedEndsAt}`;

  return (
    <div
      className={styles.container}
      onClick={() => onClick(id)}
      style={{ backgroundColor: isActive ? "var(--border)" : "" }}
    >
      <img
        src={type === "WASHING" ? wash : dry}
        className={styles.containerIcon}
        alt="icon"
      />
      <div className={styles.containerText}>
        <span
          className={`${styles.containerTextTitle} ${isActive ? styles.active : ""}`}
        >
          {title}
        </span>
        {subtitle}
      </div>
      {isActive && (
        <img
          src={accept}
          alt="accept"
          className={styles.containerAccept}
          style={{ justifySelf: "flex-end" }}
        />
      )}
    </div>
  );
};
