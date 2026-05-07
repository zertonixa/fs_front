import { Button } from "@/shared/ui/button";
import { useBookingCreate } from "../hooks";
import { useNavigate } from "react-router-dom";

interface CreateButtonProps {
  bookingData: {
    type: "WASHING" | "DRYING";
    floor: number;
    cso: number;
    starts_at: string;
    ends_at: string;
    slot_ids: string[];
    selected_places: string[];
  } | null;
  disabled: boolean;
}

export const CreateButton = ({ bookingData, disabled }: CreateButtonProps) => {
  const navigate = useNavigate();

  const handleCreateBooking = () => {
    if (!bookingData) {
      console.error("Нет данных для бронирования");
      return;
    }
    api.mutate({
      type: bookingData.type,
      starts_at: bookingData.starts_at,
      ends_at: bookingData.ends_at,
      floor: bookingData.floor,
      slot_ids: bookingData.slot_ids,
    });
  };

  const api = useBookingCreate(() => navigate("/"));

  return (
    <>
      <Button
        text="Забронировать"
        onClick={handleCreateBooking}
        backgroundColor="var(--attention)"
        width="150px"
        height="40px"
        borderRadius="5px"
        fontSize="16px"
        disabled={disabled}
      />
    </>
  );
};
