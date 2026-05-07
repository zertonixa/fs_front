import { useNearestSlots } from "@/entities/slots/hooks";
import styles from "./nearestSlots.module.scss";
import { SlotCard } from "@entities/slots/ui";
import { useNavigate } from "react-router-dom";
import { useBookingStore } from "@/shared/store/booking/booking";
import { splitDateTime } from "@/shared/helpres/formatTime";

export const NearestSlots = () => {
  const navigate = useNavigate();

  const setStartDay = useBookingStore((state) => state.setSelectedStartDay);
  const setEndDay = useBookingStore((state) => state.setSelectedEndDay);
  const setStart = useBookingStore((state) => state.setSelectedStartTime);
  const setEnd = useBookingStore((state) => state.setSelectedEndTime);
  const setSlots = useBookingStore((state) => state.addSlotId);
  const setFloor = useBookingStore((state) => state.setFloor);

  const cso = useBookingStore((state) => state.cso);

const handleClick = (
  floor: number,
  startsAt: string,
  endsAt: string,
  type: "WASHING" | "DRYING",
  slot: string
) => {
  const start = splitDateTime(startsAt);
  const end = splitDateTime(endsAt);

  setStartDay(start.day);
  setStart(startsAt);

  setEndDay(end.day);
  setEnd(endsAt);

  setFloor(floor);
  setSlots(slot);

  navigate(`/booking?type=${type}`);
};


  const slots = useNearestSlots(cso);

  return (
    <div className={styles.container}>
      <h2>Ближайшие свободные позиции</h2>
      <div className={styles.containerBody}>
        {slots.data && slots.data.map((el) => (
          <SlotCard
            key={el.id}
            type={"WASHING"}
            floor={el.floor}
            id={el.slot_id}
            place={el.slot_place}
            startsAt={el.starts_at}
            onClick={() => handleClick(el.floor, el.starts_at, el.ends_at, "WASHING", el.slot_id)}
          />
        ))}
      </div>
    </div>
  );
};
