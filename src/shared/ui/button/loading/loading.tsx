import styles from "./loading.module.scss";

export const LoadingSpinner = () => {
  return (
    <div className={styles.spinner}>
      <div className={styles.spinnerInner}></div>
    </div>
  );
};
