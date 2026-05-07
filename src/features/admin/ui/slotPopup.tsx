import type { Slot } from "@/entities/bookingSlots/hooks/types";
import { useChangeSlot } from "@/entities/bookingSlots/hooks/hooks";
import styles from "./slotPopup.module.scss";

type SlotPopupProps = {
  isOpen: boolean;
  slot: Slot | null;
  onClose: () => void;
};

export const SlotPopup = ({ isOpen, slot, onClose }: SlotPopupProps) => {
  const { toggleSlotStatus, deleteSlot } = useChangeSlot();

  if (!isOpen || !slot) return null;

  const onToggle = () => {
    toggleSlotStatus.mutate({ id: slot.id });
  };

  const onDelete = () => {
    deleteSlot.mutate({ id: slot.id }, { onSuccess: onClose });
  };

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div
        className={styles.container}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal
      >
        <div className={styles.containerHeader}>
          <div className={styles.containerHeaderTitle}>
            <span>Слот</span>
          </div>

          <button
            className={styles.containerHeaderClose}
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        </div>

        <div className={styles.containerInfo}>
          <div className={styles.containerInfoRow}>
            <span className={styles.containerInfoLabel}>ID</span>
            <span className={styles.containerInfoValue}>{slot.id}</span>
          </div>

          <div className={styles.containerInfoRow}>
            <span className={styles.containerInfoLabel}>Статус</span>
            <span className={styles.containerInfoValue}>
              {slot.isAvailable ? "Активен" : "Выключен"}
            </span>
          </div>
        </div>

        <div className={styles.containerActions}>
          <button
            className={styles.containerActionsPrimary}
            onClick={onToggle}
            type="button"
            disabled={toggleSlotStatus.isPending || deleteSlot.isPending}
          >
            {toggleSlotStatus.isPending
              ? "..."
              : slot.isAvailable
                ? "Выключить"
                : "Включить"}
          </button>

          <button
            className={styles.containerActionsDanger}
            onClick={onDelete}
            type="button"
            disabled={toggleSlotStatus.isPending || deleteSlot.isPending}
          >
            {deleteSlot.isPending ? "..." : "Удалить"}
          </button>
        </div>

        {(toggleSlotStatus.error || deleteSlot.error) && (
          <div className={styles.containerError}>
            {toggleSlotStatus.error && (
              <span>Ошибка: {toggleSlotStatus.error.message}</span>
            )}
            {deleteSlot.error && (
              <span>Ошибка: {deleteSlot.error.message}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
