import React from "react";
import styles from "./bookingSlots.module.scss";
import type { BookingSlotProps } from "./types";
import enter from "@shared/assets/enter.webp";

export const BookingSlot = React.memo(
  ({ place, isSelected, isDisabled, onClick, isEnter }: BookingSlotProps) => {
    if (isEnter)
      return (
        <div className={styles.enter}>
          <img src={enter} className={styles.enterImage} />
        </div>
      );

    return (
      <button
        disabled={isDisabled}
        className={`${styles.container} ${isSelected ? styles.selected : ""} ${isDisabled ? styles.disabled : ""}`}
        onClick={onClick}
      >
        {place}
      </button>
    );
  },
);
