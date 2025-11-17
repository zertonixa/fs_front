import { Button } from "../../shared/ui/button";

export const CancelBooking = () => {
  return (
    <Button
      text="Отменить"
      backgroundColor="var(--error)"
      borderRadius="5px"
      onClick={() => console.log("asdd")}
      width="100px"
      height="35px"
      fontSize="16px"
    />
  );
};
