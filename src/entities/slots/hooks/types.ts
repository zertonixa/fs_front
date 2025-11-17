export interface Slot {
  id: number;
  type: "WASHING" | "DRYING";
  floor: number;
  startsAt: string;
  endsAt: string;
  place: number[];
}
