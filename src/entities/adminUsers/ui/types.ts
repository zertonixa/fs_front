export interface UserCardProps {
  username: string;
  id: number;
  bookingCount: number;
  status: boolean;
  onBan: () => void;
  onUnBan: () => void;
}
