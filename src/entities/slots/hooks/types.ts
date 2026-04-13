export interface Slot {
  id: number;
  type: "WASHING" | "DRYING";
  floor: number;
  startsAt: string;
  endsAt: string;
  place: number[];
}

export interface NearestSlot {
  id: string;
  type: "WASHING" | "DRYING";
  floor: number;
  starts_at: string;
  slot_id: string;
  ends_at: string;
  slot_place: number;
}