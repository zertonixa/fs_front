import history from "../../shared/assets/history.webp";
import wash from "../../shared/assets/wash.webp";
import dry from "../../shared/assets/dry.webp";

export const data = [
  {
    name: "Стирка",
    value: wash,
    page: "booking?type=WASHING",
  },
  {
    name: "Сушка",
    value: dry,
    page: "booking?type=DRYING",
  },
  {
    name: "История",
    value: history,
    page: "history",
  },
];
