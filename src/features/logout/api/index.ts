import { useApiMutation } from "@/shared/lib/hooks/useApiMutation"

export const useLogout = () => {
    const api = useApiMutation("auth/logout-all", "post", {invalidate: ["user"]});
    return api;
}