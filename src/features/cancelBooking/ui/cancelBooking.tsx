import { Button } from "../../../shared/ui/button";
import { useCancelBooking } from "../hooks";

export const CancelBooking = ({ bookingIds }: { bookingIds: string[] }) => {
  const api = useCancelBooking();

  return (
    <Button
      text="Отменить"
      backgroundColor="var(--error)"
      borderRadius="5px"
      onClick={() => api.mutate(bookingIds)}
      loading={api.isPending}
      width="100px"
      height="35px"
      fontSize="16px"
    />
  );
};
