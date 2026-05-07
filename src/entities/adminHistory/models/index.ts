export interface AdminStory {
  id: string;
  moderator_id: string;
  created_at: Date;
  action: string;
  description: string;
  slot_id?: string;
  target_user_id?: string;
}

export type ActionType =
  | "ban"
  | "unban"
  | "grant_admin"
  | "revoke_admin"
  | "change_slot";
