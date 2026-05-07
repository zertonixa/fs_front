import { useApiMutation } from "@/shared/lib/hooks/useApiMutation";
import type { User } from "../models";

export const useAdmin = () => {
  const toggleAdmin = useApiMutation<User, { id: string }>(
    ({ id }) => `/admin/role/${id}/toggle`,
    "patch",
    { invalidate: ["users"] },
  );

  return { toggleAdmin };
};
