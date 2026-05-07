import { useEffect, useState } from "react";

import { useSlots } from "@/entities/bookingSlots/hooks/hooks";
import type { Slot } from "@/entities/bookingSlots/hooks/types";

import styles from "./adminSlots.module.scss";
import { LoadingSpinner } from "@/shared/ui/button/loading/loading";
import { BookingSlot } from "@/entities/bookingSlots/ui";
import { SlotPopup } from "@/features/admin/ui/slotPopup";
import { CreateSlotPopup } from "@/features/createSlot";

import { useBookingStore } from "@/shared/store/booking/booking";

export const AdminSlots = () => {
  const cso = useBookingStore((s) => s.cso) as 1 | 3 | 4;
  const floor = useBookingStore((s) => s.floor);
  const setCso = useBookingStore((s) => s.setCso);
  const setFloor = useBookingStore((s) => s.setFloor);

  const slots = useSlots({ type: "WASHING", cso, floor });

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const openPopup = (slot: Slot) => {
    setSelectedSlot(slot);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedSlot(null);
  };

  const selectedId = selectedSlot?.id ?? null;

  return (
    <>
      <div className={styles.container}>
        <div className={styles.containerHeader}>
          <div className={styles.containerHeaderFilters}>
            <label className={styles.containerHeaderFiltersItem}>
              <span className={styles.containerHeaderFiltersItemLabel}>
                CSO
              </span>
              <select
                className={styles.containerHeaderFiltersItemSelect}
                value={cso}
                onChange={(e) => setCso(Number(e.target.value))}
              >
                <option value={1}>1</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </label>

            <label className={styles.containerHeaderFiltersItem}>
              <span className={styles.containerHeaderFiltersItemLabel}>
                Этаж
              </span>
              <select
                className={styles.containerHeaderFiltersItemSelect}
                value={floor}
                onChange={(e) => setFloor(Number(e.target.value))}
              >
                {Array.from({ length: 15 }, (_, i) => i + 1).map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            className={styles.containerHeaderCreate}
            onClick={() => setIsCreateOpen(true)}
          >
            + Создать слот
          </button>
        </div>

        <div className={styles.containerWrapper}>
          {slots.isPending && <LoadingSpinner />}
          {slots.error && <span>Ошибка при загрузке слотов</span>}
          {slots.data?.length === 0 && <span>Слотов на данном этаже нет</span>}
          {slots.data &&
            slots.data.map((row, rowIdx) => (
              <div key={rowIdx} className={styles.containerItems}>
                {row.map((slot) => (
                  <div key={slot.id} className={styles.containerItemsItem}>
                    <BookingSlot
                      place={slot.place}
                      isDisabled={false}
                      isSelected={selectedId === slot.id}
                      isEnter={false}
                      onClick={() => openPopup(slot)}
                    />
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>

      <SlotPopup
        isOpen={isPopupOpen}
        slot={selectedSlot}
        onClose={closePopup}
      />

      <CreateSlotPopup
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </>
  );
};
