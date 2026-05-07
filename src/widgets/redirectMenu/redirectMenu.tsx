import styles from "./redirectMenu.module.scss";
import { data } from "./lib";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { useBookingStore } from "@/shared/store/booking/booking";

export const RedirectMenu = () => {
  const navigate = useNavigate();

  const setBooking = useBookingStore((state) => state.setBookingType);

  const handleClick = useCallback((str: string, type: "DRYING" | "WASHING") => {
    setBooking(type);
    navigate(`/${str}`);
  }, []);

  return (
    <div className={styles.container}>
      {data.map((el) => (
        <div
          key={el.name}
          className={styles.containerCard}
          onClick={() => handleClick(el.page, el.type)}
        >
          <img src={el.value} className={styles.containerCardImage} />
          {el.name}
        </div>
      ))}
    </div>
  );
};
