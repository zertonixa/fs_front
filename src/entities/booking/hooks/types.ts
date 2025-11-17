export interface Booking {
  type: "WASHING" | "DRYING";
  floor: number;
  startsAt: string;
  endsAt: string;
  place: number[];
  id: number;
}
