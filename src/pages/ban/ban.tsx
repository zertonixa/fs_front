import { useBanResponse } from "@/entities/adminUsers/hooks";
import styles from "./ban.module.scss";
import { LoadingSpinner } from "@/shared/ui/button/loading/loading";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export const BanPage = () => {
  const info = useBanResponse();
  const navigate = useNavigate();

  useEffect(() => {
    if (info.data?.is_banned === false) navigate("/");
  }, [info.data, navigate]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return new Intl.DateTimeFormat("ru-RU", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(date);
  };

  return (
    <div className={styles.container}>
      {info.isPending && <LoadingSpinner />}

      {info.error && (
        <span className={styles.containerError}>
          {`Ошибка загрузки данных: ${info.error.message}`}
        </span>
      )}

      {info.data && (
        <div className={styles.containerInfo}>
          <span>Доступ к приложению был ограничен</span>
          <span>
            Дата блокировки: {formatDate(info.data.banned_at || "")}
          </span>
          <span>
            Имя модератора: {info.data.moderator_username}
          </span>
        </div>
      )}
    </div>
  );
};