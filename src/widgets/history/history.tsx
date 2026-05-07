import { useHistory } from "@/entities/history/hooks";
import styles from "./history.module.scss";
import { HistoryCard } from "@/entities/history/ui";
import { LoadingSpinner } from "@/shared/ui/button/loading/loading";

export const History = ({ close }: { close: () => void }) => {
  const bookings = useHistory();

  return (
    <div className={styles.container} onClick={close}>
      <div className={styles.containerBody}>
        <h2 className={styles.containerBodyTitle}>История</h2>
        <div className={styles.containerBodyItems}>
          {bookings.data?.map((el, index) => (
            <HistoryCard
              key={el.starts_at + index}
              slot_places={el.slot_places}
              starts_at={el.starts_at}
              ends_at={el.ends_at}
              type={el.type}
              floor={el.floor}
              status={el.status}
            />
          ))}
          {bookings.isPending && <LoadingSpinner />}
          {bookings.isError && <span>Ошибка загрузки</span>}
        </div>
      </div>
    </div>
  );
};
