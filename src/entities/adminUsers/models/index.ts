export type SortBy = "created_at" | "updated_at";
export type SortOrder = "asc" | "desc";

export type User = {
  id: string;
  telegram_id: number;
  username: string;
  is_banned: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export type BanResponse = {
  is_banned: boolean;
  banned_at?: string | null;
  description?: string | null;
  moderator_id?: string | null;
  moderator_username?: string | null;
};

export type PaginatedUsersResponse = {
  items: User[];
  page: number;
  per_page: number;
  total: number;
  pages: number;
  has_next: boolean;
};
