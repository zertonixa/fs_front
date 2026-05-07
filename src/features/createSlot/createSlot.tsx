import { useEffect, useMemo, useState } from "react";
import styles from "./createSlot.module.scss";

import { useChangeSlot } from "@/entities/bookingSlots/hooks/hooks";
import { useBookingStore } from "@/shared/store/booking/booking";

type CreateSlotPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const CreateSlotPopup = ({ isOpen, onClose }: CreateSlotPopupProps) => {
  const { createSlot } = useChangeSlot();

  const bookingType = useBookingStore((s) => s.bookingType);
  const floor = useBookingStore((s) => s.floor);
  const cso = useBookingStore((s) => s.cso) as 1 | 3 | 4;

  const [row, setRow] = useState<number>(1);
  const [place, setPlace] = useState<number>(1);
  const [status, setStatus] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) return;
    setRow(1);
    setPlace(1);
    setStatus(true);
  }, [isOpen]);

  const canSubmit = useMemo(() => {
    return (
      Number.isFinite(row) && row > 0 && Number.isFinite(place) && place > 0
    );
  }, [row, place]);

  if (!isOpen) return null;

  const submit = () => {
    if (!canSubmit) return;

    createSlot.mutate(
      {
        type: bookingType,
        floor,
        cso,
        row,
        place,
        status,
      },
      {
        onSuccess: () => onClose(),
      },
    );
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
            <span>Создать слот</span>
            <span className={styles.containerHeaderSub}>
              {bookingType} • этаж {floor} • cso {cso}
            </span>
          </div>

          <button
            className={styles.containerHeaderClose}
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        </div>

        <div className={styles.containerForm}>
          <div className={styles.containerFormGrid}>
            <label className={styles.containerFormField}>
              <span className={styles.containerFormLabel}>Тип</span>
              <input
                className={styles.containerFormInput}
                value={bookingType}
                disabled
              />
            </label>

            <label className={styles.containerFormField}>
              <span className={styles.containerFormLabel}>Этаж</span>
              <input
                className={styles.containerFormInput}
                value={floor}
                disabled
              />
            </label>

            <label className={styles.containerFormField}>
              <span className={styles.containerFormLabel}>CSO</span>
              <input
                className={styles.containerFormInput}
                value={cso}
                disabled
              />
            </label>

            <label className={styles.containerFormField}>
              <span className={styles.containerFormLabel}>Ряд (row)</span>
              <input
                className={styles.containerFormInput}
                type="number"
                min={1}
                value={row}
                onChange={(e) => setRow(Number(e.target.value))}
              />
            </label>

            <label className={styles.containerFormField}>
              <span className={styles.containerFormLabel}>Место (place)</span>
              <input
                className={styles.containerFormInput}
                type="number"
                min={1}
                value={place}
                onChange={(e) => setPlace(Number(e.target.value))}
              />
            </label>

            <label className={styles.containerFormField}>
              <span className={styles.containerFormLabel}>Активен</span>
              <select
                className={styles.containerFormInput}
                value={status ? "true" : "false"}
                onChange={(e) => setStatus(e.target.value === "true")}
              >
                <option value="true">Да</option>
                <option value="false">Нет</option>
              </select>
            </label>
          </div>

          <div className={styles.containerFormActions}>
            <button
              className={styles.containerFormPrimary}
              type="button"
              onClick={submit}
              disabled={!canSubmit || createSlot.isPending}
            >
              {createSlot.isPending ? "Создаю..." : "Создать"}
            </button>

            <button
              className={styles.containerFormSecondary}
              type="button"
              onClick={onClose}
              disabled={createSlot.isPending}
            >
              Отмена
            </button>
          </div>

          {createSlot.error && (
            <div className={styles.containerFormError}>
              {createSlot.error.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
