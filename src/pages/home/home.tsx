import { Booking } from "@widgets/booking/booking";
import { Header } from "@widgets/header/header";
import { RedirectMenu } from "@widgets/redirectMenu/redirectMenu";
import { NearestSlots } from "@/widgets/nearestSlots";
import styles from "./home.module.scss";

export const Home = () => {
  return (
    <div className={styles.container}>
      <Header title="Доброе утро, User!" />
      <div className={styles.containerWrap}>
        <div className={styles.containerWrapLeft}>
          <RedirectMenu />
          <Booking />
        </div>
        <NearestSlots />
      </div>
    </div>
  );
};
