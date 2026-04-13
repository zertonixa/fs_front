import { useApiMutation } from "@/shared/lib/hooks/useApiMutation";

export function useCancelBooking() {

    const api = useApiMutation(`bookings`, "patch", {invalidate: ["user-bookings"]});

    return api;

}