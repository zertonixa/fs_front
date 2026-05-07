import styles from "./adminBar.module.scss";
import { widgets } from "./lib";

type AdminWidget = "Users" | "Slots" | "History" | "Reports";

type AdminBarProps = {
  value: AdminWidget;
  onChange: (value: AdminWidget) => void;
};

export const AdminBar = ({ value, onChange }: AdminBarProps) => {
  return (
    <div className={styles.container}>
      {widgets.map((el) => (
        <button
          key={el.value}
          onClick={() => onChange(el.value as AdminWidget)}
          className={styles.containerButton}
          aria-pressed={value === el.value}
          type="button"
        >
          {el.name}
        </button>
      ))}
    </div>
  );
};