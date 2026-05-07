import { Booking } from "@widgets/booking/booking";
import { Header } from "@widgets/header/header";
import { RedirectMenu } from "@widgets/redirectMenu/redirectMenu";
import { NearestSlots } from "@/widgets/nearestSlots";
import styles from "./home.module.scss";
import { useApiQuery } from "@/shared/lib/hooks/useApiQuery";
import { History } from "@/widgets/history";
import { useState } from "react";
import historyImage from "../../shared/assets/history.webp";
import { Seo } from "@/shared/lib/seo/seo";

const SITE_URL = "https://example.com";

export const Home = () => {
  const weather = useApiQuery<{ city: string; temp: number }>({
    key: ["weather"],
    path: "weather/weather",
  });

  const [history, setHistory] = useState<boolean>(false);

  return (
    <div className={styles.container}>
      <Seo
        title="Главная — сервис онлайн-бронирования общежитий МТУСИ"
        description="Сервис для онлайн-бронирования, просмотра ближайших слотов и истории записей."
        canonical={`${SITE_URL}/`}
      />

      <Header
        title={
          weather.data
            ? `В ${weather.data.city.slice(0, -1) + "е"} сейчас ${weather.data.temp}°`
            : ""
        }
      />

      <div className={styles.containerWrap}>
        <div className={styles.containerWrapLeft}>
          <div className={styles.containerWrapLeftButtons}>
            <RedirectMenu />
            <div
              className={styles.containerWrapLeftButtonsHistory}
              onClick={() => setHistory(true)}
            >
              <img
                src={historyImage}
                className={styles.containerWrapLeftButtonsHistoryImage}
                alt="История"
              />
              История
            </div>
          </div>
          <Booking />
        </div>
        <NearestSlots />
      </div>

      {history && <History close={() => setHistory(false)} />}
    </div>
  );
};