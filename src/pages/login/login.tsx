// import { useNavigate } from "react-router-dom";
import styles from "./login.module.scss";

export const LoginPage = () => {
  // const navigate = useNavigate();

  const handleClick = () => {
    window.location.href = "/";
  };

  return (
    <div className={styles.container}>
      <span>Похоже, вы вышли из своего аккаунта. Авторизуйтесь заново</span>
      <button
        type="button"
        onClick={handleClick}
        className={styles.containerButton}
      >
        Авторизоваться
      </button>
    </div>
  );
};
