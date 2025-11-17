import { useApiMutation } from "@/shared/lib/hooks/useApiMutation";
import type { User } from "./types";

export const useBanUser = () => {
  const ban = useApiMutation<User>("/admin/ban", "post");
  const unban = useApiMutation<User>("/admin/unban", "post");

  return { ban, unban };
};
