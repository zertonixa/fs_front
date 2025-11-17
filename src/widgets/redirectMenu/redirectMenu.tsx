import styles from "./redirectMenu.module.scss";
import { data } from "./lib";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export const RedirectMenu = () => {
  const navigate = useNavigate();

  const handleClick = useCallback((str: string) => {
    navigate(`/${str}`);
  }, []);

  return (
    <div className={styles.container}>
      {data.map((el) => (
        <div
          className={styles.containerCard}
          onClick={() => handleClick(el.page)}
        >
          <img src={el.value} className={styles.containerCardImage} />
          {el.name}
        </div>
      ))}
    </div>
  );
};
