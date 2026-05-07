import { useApiQuery } from "@/shared/lib/hooks/useApiQuery";
import type { ActionType, AdminStory } from "../models";

interface UseAdminHistoryParams {
  limit?: number;
  offset?: number;
  moderator_id?: string;
  target_user_id?: string;
  action?: ActionType;
}

export const useAdminHistory = (params: UseAdminHistoryParams = {}) => {
  const { limit, offset, moderator_id, target_user_id, action } = params;

  return useApiQuery<AdminStory[]>({
    key: [
      "adminHistory",
      {
        limit: limit ?? null,
        offset: offset ?? null,
        moderator_id: moderator_id ?? null,
        target_user_id: target_user_id ?? null,
        action: action ?? null,
      },
    ],
    path: "admin/history",
    params: {
      ...(limit !== undefined ? { limit } : {}),
      ...(offset !== undefined ? { offset } : {}),
      ...(moderator_id !== undefined ? { moderator_id } : {}),
      ...(target_user_id !== undefined ? { target_user_id } : {}),
      ...(action !== undefined ? { action } : {}),
    },
  });
};
