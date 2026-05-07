import { Header } from "@/widgets/header";
import styles from "./booking.module.scss";
import { Calendar } from "@/entities/calendar/ui";
import { TimeBarWidget } from "@/widgets/timeBar";
import { BookingSlotWidget } from "@/widgets/bookingSlot/bookingSlot";
import { useSearchParams } from "react-router-dom";
import { Seo } from "@/shared/lib/seo/seo";

const SITE_URL = "https://example.com";

export const BookingPage = () => {
  const [params] = useSearchParams();

  const isWashing = params.get("type") === "WASHING";

  const title = `Бронирование ${isWashing ? "стирки" : "сушки"}`;
  const description = isWashing
    ? "Забронируйте стиральную машину на удобное для вас время."
    : "Забронируйте место в сушильной комнате на удобное для вас время.";
  const canonical = `${SITE_URL}/booking?type=${isWashing ? "WASHING" : "DRYING"}`;

  return (
    <div className={styles.container}>
      <Seo title={title} description={description} canonical={canonical} />

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
