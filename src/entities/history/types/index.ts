export interface HistoryCardProps {
  type: "WASHING" | "DRYING";
  starts_at: string;
  ends_at: string;
  floor: number;
  slot_places: number[];
  status: "NEW" | "DONE" | "CANCELLED";
}
