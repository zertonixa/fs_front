import { BookingSlot } from "@/entities/bookingSlots/ui";
import styles from "./bookingSlot.module.scss";
import type { BookingSlotProps } from "@/entities/bookingSlots/ui/types";
import { Button } from "@/shared/ui/button";
import { useBookingParams } from "@/features/hooks/useParams";
import React, { useEffect, useRef, useState } from "react";

export const bookingSlotsMock: BookingSlotProps[] = [
  {
    place: 1,
    isSelected: false,
    isDisabled: false,
    isEnter: true,
    onClick: () => {},
  },
  {
    place: 2,
    isSelected: true,
    isDisabled: false,
    isEnter: false,
    onClick: () => {},
  },
  {
    place: 3,
    isSelected: false,
    isDisabled: true,
    isEnter: false,
    onClick: () => {},
  },
  {
    place: 4,
    isSelected: false,
    isDisabled: false,
    isEnter: false,
    onClick: () => {},
  },
  {
    place: 5,
    isSelected: false,
    isDisabled: false,
    isEnter: false,
    onClick: () => {},
  },

  {
    place: 6,
    isSelected: false,
    isDisabled: false,
    isEnter: false,
    onClick: () => {},
  },
  {
    place: 7,
    isSelected: true,
    isDisabled: false,
    isEnter: false,
    onClick: () => {},
  },
  {
    place: 8,
    isSelected: false,
    isDisabled: false,
    isEnter: false,
    onClick: () => {},
  },
  {
    place: 9,
    isSelected: false,
    isDisabled: true,
    isEnter: false,
    onClick: () => {},
  },
  {
    place: 10,
    isSelected: false,
    isDisabled: false,
    isEnter: false,
    onClick: () => {},
  },

  {
    place: 11,
    isSelected: false,
    isDisabled: false,
    isEnter: false,
    onClick: () => {},
  },
  {
    place: 12,
    isSelected: false,
    isDisabled: false,
    isEnter: false,
    onClick: () => {},
  },
  {
    place: 13,
    isSelected: true,
    isDisabled: false,
    isEnter: false,
    onClick: () => {},
  },
  {
    place: 14,
    isSelected: false,
    isDisabled: false,
    isEnter: false,
    onClick: () => {},
  },
  {
    place: 15,
    isSelected: false,
    isDisabled: true,
    isEnter: false,
    onClick: () => {},
  },

  {
    place: 16,
    isSelected: false,
    isDisabled: false,
    isEnter: false,
    onClick: () => {},
  },
  {
    place: 17,
    isSelected: true,
    isDisabled: false,
    isEnter: false,
    onClick: () => {},
  },
  {
    place: 18,
    isSelected: false,
    isDisabled: false,
    isEnter: false,
    onClick: () => {},
  },
  {
    place: 19,
    isSelected: false,
    isDisabled: false,
    isEnter: false,
    onClick: () => {},
  },
  {
    place: 20,
    isSelected: false,
    isDisabled: true,
    isEnter: false,
    onClick: () => {},
  },
];

export const BookingSlotWidget = React.memo(() => {
  const { params, togglePlace } = useBookingParams();

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(params.places),
  );

  const handleToggle = (id: number) => {
    const idStr = String(id);

    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idStr)) next.delete(idStr);
      else if (next.size < 6) next.add(idStr);
      return next;
    });
  };

  const isSelected = (id: number) => selected.has(String(id));

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      togglePlace(Array.from(selected));
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [selected]);

  return (
    <div className={styles.container}>
      <div className={styles.containerGrid} style={{ ["--cols" as any]: 5 }}>
        {bookingSlotsMock.map((place) => (
          <BookingSlot
            key={place.place}
            isEnter={place.isEnter}
            place={place.place}
            isSelected={isSelected(place.place)}
            isDisabled={place.isDisabled}
            onClick={() => handleToggle(place.place)}
          />
        ))}
      </div>
      <div className={styles.containerButton}>
        <Button
          text="Забронировать"
          onClick={console.log}
          backgroundColor="var(--attention)"
          width="150px"
          height="40px"
          borderRadius="5px"
          fontSize="16px"
        />
      </div>
    </div>
  );
});
