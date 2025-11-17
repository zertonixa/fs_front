import { Header } from "@/widgets/header";
import styles from "./booking.module.scss";
import { Calendar } from "@/entities/calendar/ui";
import { TimeBarWidget } from "@/widgets/timeBar";
import { BookingSlotWidget } from "@/widgets/bookingSlot/bookingSlot";

export const BookingPage = () => {
  return (
    <div className={styles.container}>
      <Header title="Выберите дату, время и места" />
      <div className={styles.containerRow}>
        <div className={styles.containerRowCalendar}>
          <Calendar />
        </div>
        <div className={styles.containerRowBooking}>
          <TimeBarWidget />
          <BookingSlotWidget />
        </div>
      </div>
    </div>
  );
};
