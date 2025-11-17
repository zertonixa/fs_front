import styles from "./booking.module.scss";
import { useUserBookings } from "@entities/booking/hooks/hooks";
import { BookingCard } from "@entities/booking/ui/bookingCard";
import type { Booking as BookingType } from "@entities/booking/hooks/types";
import { useState } from "react";
import { CancelBooking } from "@features/cancelBooking/cancelBooking";

export const mocks: BookingType[] = [
  {
    id: 1,
    type: "DRYING",
    floor: 1,
    startsAt: "2025-11-15T10:00:00",
    endsAt: "2025-11-15T11:00:00",
    place: [1, 2],
  },
  {
    id: 2,
    type: "WASHING",
    floor: 2,
    startsAt: "2025-11-15T12:30:00",
    endsAt: "2025-11-15T13:00:00",
    place: [3],
  },
  {
    id: 3,
    type: "WASHING",
    floor: 1,
    startsAt: "2025-11-16T09:00:00",
    endsAt: "2025-11-16T10:30:00",
    place: [4],
  },
  {
    id: 4,
    type: "DRYING",
    floor: 3,
    startsAt: "2025-11-16T14:00:00",
    endsAt: "2025-11-16T14:45:00",
    place: [2, 5],
  },
  {
    id: 5,
    type: "WASHING",
    floor: 2,
    startsAt: "2025-11-17T18:00:00",
    endsAt: "2025-11-17T19:00:00",
    place: [1],
  },
];

export const Booking = () => {
  const [selected, setSelected] = useState<number[]>([]);

  const isSelected = (id: BookingType["id"]) => selected.includes(id);

  const handleClick = (id: BookingType["id"]) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  // const booking = useUserBookings();

  // if (booking.isLoading) return <div>загрузка...</div>
  // if (!booking.data?.length) return <div>нет броней</div>

  return (
    <div className={styles.container}>
      Ваши брони
      <div className={styles.containerBody}>
        {mocks.map((el) => (
          <BookingCard
            floor={el.floor}
            place={el.place}
            startsAt={el.startsAt}
            endsAt={el.endsAt}
            type={el.type}
            id={el.id}
            isActive={isSelected(el.id)}
            onClick={handleClick}
          />
        ))}
      </div>
      <div className={styles.containerCancel}>
        <CancelBooking />
      </div>
    </div>
  );
};
