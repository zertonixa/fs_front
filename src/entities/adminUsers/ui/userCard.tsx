import type { UserCardProps } from "./types";
import styles from "./userCard.module.scss";

export const UserCard = ({
  username,
  status,
  is_admin,
  canChangeAdmin,
  isAdminLoading,
  onToggleAdmin,
  onBan,
  onUnBan,
}: UserCardProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.containerInfo}>
        <span className={styles.containerInfoTitle}>{username}</span>

        <span className={styles.containerInfoText}>
          {`Статус: ${!status ? "Активен" : "Заблокирован"}`}
        </span>

        <div className={styles.containerMeta}>
          <span className={styles.containerMetaLabel}>Админ</span>

          <button
            type="button"
            className={styles.toggle}
            onClick={() => canChangeAdmin && onToggleAdmin?.()}
            disabled={!canChangeAdmin || !!isAdminLoading}
            aria-pressed={is_admin}
            aria-label="Переключить роль администратора"
          >
            <span
              className={`${styles.toggleThumb} ${
                is_admin ? styles.toggleThumbOn : ""
              }`}
            />
          </button>

          <span className={styles.containerMetaValue}>
            {is_admin ? "Да" : "Нет"}
          </span>
        </div>
      </div>

      <button
        className={styles.containerButton}
        onClick={!status ? onBan : onUnBan}
        disabled={is_admin && !canChangeAdmin}
      >
        {status ? "Разбанить" : "Забанить"}
      </button>
    </div>
  );
};
