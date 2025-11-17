import styles from "./nearestSlots.module.scss";
import { useNearestSlots } from "@entities/slots/hooks";
import type { Slot } from "@entities/slots/hooks/types";
import { SlotCard } from "@entities/slots/ui";
import { useNavigate } from "react-router-dom";

export const slotMocks: Slot[] = [
  {
    id: 1,
    type: "WASHING",
    floor: 11,
    startsAt: "2025-10-06T18:00:00",
    endsAt: "2025-10-06T19:00:00",
    place: [3],
  },
  {
    id: 2,
    type: "DRYING",
    floor: 9,
    startsAt: "2025-10-06T18:30:00",
    endsAt: "2025-10-06T19:15:00",
    place: [8],
  },
  {
    id: 3,
    type: "WASHING",
    floor: 4,
    startsAt: "2025-10-06T19:30:00",
    endsAt: "2025-10-06T20:00:00",
    place: [1],
  },
  {
    id: 4,
    type: "DRYING",
    floor: 6,
    startsAt: "2025-10-07T10:00:00",
    endsAt: "2025-10-07T10:45:00",
    place: [2, 3],
  },
  {
    id: 5,
    type: "WASHING",
    floor: 2,
    startsAt: "2025-10-07T11:00:00",
    endsAt: "2025-10-07T12:00:00",
    place: [1, 4],
  },
];

export const NearestSlots = () => {
  const navigate = useNavigate();

  const handleClick = (floor: number, startsAt: string): void => {
    navigate(`/booking/?floor=${floor}startsAt=${startsAt}`);
  };

  // const slots = useNearestSlots();

  // if (slots.isLoading) return <div>загрузка...</div>
  // if (!slots.data?.length) return <div>нет броней</div>

  return (
    <div className={styles.container}>
      Ближайшие свободные позиции
      <div className={styles.containerBody}>
        {slotMocks.map((el) => (
          <SlotCard
            key={el.id}
            type={el.type}
            floor={el.floor}
            id={el.id}
            startsAt={el.startsAt}
            onClick={() => handleClick(el.floor, el.startsAt)}
          />
        ))}
      </div>
    </div>
  );
};
