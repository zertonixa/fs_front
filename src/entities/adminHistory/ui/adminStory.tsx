import type { AdminStory } from "../models";
import styles from "./adminStory.module.scss";

export const AdminStoryCard = ({
  id,
  moderator_id,
  target_user_id,
  action,
  slot_id,
  created_at,
  description,
}: AdminStory) => {
  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionLabel = (action: string) => {
    const actions: Record<string, string> = {
      ban: "Бан",
      unban: "Разбан",
      grant_admin: "Выдача админа",
      revoke_admin: "Снятие админа",
      change_slot: "Изменение слота",
    };
    return actions[action] || action;
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardHeaderId}>ID: {id}</span>
        <span className={styles.cardHeaderDate}>{formatDate(created_at)}</span>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.cardContentRow}>
          <span className={styles.cardContentRowLabel}>Модератор:</span>
          <span className={styles.cardContentRowValue}>{moderator_id}</span>
        </div>

        {target_user_id && (
          <div className={styles.cardContentRow}>
            <span className={styles.cardContentRowLabel}>Пользователь:</span>
            <span className={styles.cardContentRowValue}>{target_user_id}</span>
          </div>
        )}

        {slot_id && (
          <div className={styles.cardContentRow}>
            <span className={styles.cardContentRowLabel}>Слот:</span>
            <span className={styles.cardContentRowValue}>{slot_id}</span>
          </div>
        )}

        <div className={styles.cardContentRow}>
          <span className={styles.cardContentRowLabel}>Действие:</span>
          <span
            className={`${styles.cardContentRowValue} ${styles[`cardContentRowValue_${action}`]}`}
          >
            {getActionLabel(action)}
          </span>
        </div>

        <div className={styles.cardContentDescription}>
          <span className={styles.cardContentDescriptionLabel}>Описание:</span>
          <p className={styles.cardContentDescriptionText}>{description}</p>
        </div>
      </div>
    </div>
  );
};
