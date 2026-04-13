export interface SlotCardProps {
  type: "WASHING" | "DRYING";
  floor: number;
  id: number | string;
  place?: number[] | number;
  startsAt: string;
  onClick: () => void;
}
