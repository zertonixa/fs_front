import { useApiMutation } from "@/shared/lib/hooks/useApiMutation";

export function useBookingCreate(fun: () => void) {
    const api = useApiMutation("bookings/create", "post", {invalidate: ["user-bookings", "user-nearest"], onSuccess: fun});

    return api;
}