export interface UserCardProps {
  username: string;
  id: string;
  status: boolean;
  onBan: () => void;
  onUnBan: () => void;
  is_admin: boolean;
  canChangeAdmin: boolean;
  isAdminLoading?: boolean;
  onToggleAdmin?: () => void;
}
