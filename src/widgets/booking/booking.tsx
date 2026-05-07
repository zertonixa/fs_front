import styles from "./booking.module.scss";
import { BookingCard } from "@entities/booking/ui/bookingCard";
import type { Booking as BookingType } from "@entities/booking/hooks/types";
import { useState } from "react";
import { CancelBooking } from "@/features/cancelBooking/ui/cancelBooking";
import { useUserBookings } from "@/entities/booking/hooks";
import { LoadingSpinner } from "@/shared/ui/button/loading/loading";

export const Booking = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const isSelected = (id: BookingType["id"]) => selected.includes(id);

  const handleClick = (id: BookingType["id"]) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const booking = useUserBookings();

  if (booking.isLoading) return <LoadingSpinner />;

  return (
    <div className={styles.container}>
      <h2>Ваши брони</h2>
      <div className={styles.containerBody}>
        {booking.data &&
          booking.data.map((el) => (
            <BookingCard
              key={el.id}
              floor={el.floor}
              place={el.slot_places}
              startsAt={el.starts_at}
              endsAt={el.ends_at}
              type={el.type}
              id={el.id}
              isActive={isSelected(el.id)}
              onClick={handleClick}
            />
          ))}
      </div>
      {!booking.data ||
        (booking.data.length === 0 && (
          <div className={styles.text}>Броней нет</div>
        ))}
      <div className={styles.containerCancel}>
        <CancelBooking bookingIds={selected} />
      </div>
    </div>
  );
};
