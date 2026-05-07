import styles from "./csoCard.module.scss";
import accept from "@shared/assets/accept.webp";

interface CsoCardProps {
  number: number;
  subtitle: string;
  isActive: boolean;
  onClick: (number: number) => void;
  leftIcon?: string;
  width?: string;
  height?: string;
}

export const CsoCard = ({
  number,
  subtitle,
  isActive,
  onClick,
  leftIcon,
  width,
  height,
}: CsoCardProps) => (
  <div
    className={styles.container}
    onClick={() => onClick(number)}
    style={{
      width: width || "",
      height: height || "",
      backgroundColor: isActive ? "var(--border)" : "",
    }}
  >
    {leftIcon && (
      <img src={leftIcon} className={styles.containerIcon} alt="icon" />
    )}
    <div className={styles.containerText}>
      <span
        className={`${styles.containerTextTitle} ${isActive ? styles.active : ""}`}
      >{`ЦСО №${number}`}</span>
      {subtitle}
    </div>
    {isActive && (
      <img
        src={accept}
        alt="accept"
        className={styles.containerIcon}
        style={{ justifySelf: "flex-end" }}
      />
    )}
  </div>
);
