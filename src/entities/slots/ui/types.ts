export interface SlotCardProps {
  type: "WASHING" | "DRYING";
  floor: number;
  id: number;
  place?: number[];
  startsAt: string;
  onClick: () => void;
}
