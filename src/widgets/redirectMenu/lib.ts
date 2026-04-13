import wash from "../../shared/assets/wash.webp";
import dry from "../../shared/assets/dry.webp";

export const data = [
  {
    name: "Стирка",
    value: wash,
    page: "booking?type=WASHING",
    type: "WASHING",
  },
  {
    name: "Сушка",
    value: dry,
    page: "booking?type=DRYING",
    type: "DRYING",
  },
] as const;

export type BookingType = typeof data[number]["type"];