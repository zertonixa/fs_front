import type { UserCardProps } from "./types";
import styles from "./userCard.module.scss";

export const UserCard = ({
  username,
  bookingCount,
  status,
  onBan,
  onUnBan,
}: UserCardProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.containerInfo}>
        <span className={styles.containerInfoTitle}>{username}</span>
        <span
          className={styles.containerInfoText}
        >{`Броней: ${bookingCount}`}</span>
        <span
          className={styles.containerInfoText}
        >{`Статус: ${status ? "Активен" : "Заблокирован"}`}</span>
      </div>
      <button
        className={styles.containerButton}
        onClick={status ? onBan : onUnBan}
      >
        {status ? "Разбанить" : "Забанить"}
      </button>
    </div>
  );
};
