import styles from "./adminBar.module.scss";
import type { AdminBarProps } from "./types";
import { widgets } from "./lib";

export const AdminBar = ({ onClick }: AdminBarProps) => {
  return (
    <div className={styles.container}>
      {widgets.map((el) => (
        <button
          onClick={() => onClick(el.value)}
          className={styles.containerButton}
        >
          {el.name}
        </button>
      ))}
    </div>
  );
};
