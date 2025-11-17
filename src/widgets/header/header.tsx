import styles from "./header.module.scss";
import { SelectCso } from "@features/selectCso/selectCso";
import home from "@shared/assets/home.webp";
import type { HeadersProps } from "./types";
import { useLocation, useNavigate } from "react-router-dom";

export const Header = ({ title }: HeadersProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.containerTitle}>
        {pathname !== "/" && (
          <button
            className={styles.containerTitleImage}
            type="button"
            onClick={handleClick}
          >
            <img
              src={home}
              alt="home"
              className={styles.containerTitleImageImg}
            />
          </button>
        )}
        <span className={styles.containerTitleTitle}>{title}</span>
      </div>
      <SelectCso />
    </div>
  );
};
