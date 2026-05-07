import { useApiMutation } from "@/shared/lib/hooks/useApiMutation";
import type { User } from "./types";

export const useBanUser = () => {
  const ban = useApiMutation<User, { id: string }>(
    ({ id }) => `/admin/ban/${id}`,
    "patch",
    { invalidate: ["users"] },
  );

  const unban = useApiMutation<User, { id: string }>(
    ({ id }) => `/admin/unban/${id}`,
    "patch",
    { invalidate: ["users"] },
  );

  return { ban, unban };
};
