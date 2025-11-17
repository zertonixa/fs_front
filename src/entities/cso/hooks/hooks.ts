import { useApiMutation } from "@shared/lib/hooks/useApiMutation";
import type { User } from "./types";

export const useUserCSO = () => useApiMutation<User>("/user/cso", "post");
