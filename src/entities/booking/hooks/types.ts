export interface Booking {
  type: "WASHING" | "DRYING";
  floor: number;
  starts_at: string;
  ends_at: string;
  slot_places: number[];
  id: string;
}
