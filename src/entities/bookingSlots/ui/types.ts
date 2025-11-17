export interface BookingSlotProps {
  place: number;
  isSelected: boolean;
  isDisabled: boolean;
  isEnter: boolean;
  onClick: () => void;
}
