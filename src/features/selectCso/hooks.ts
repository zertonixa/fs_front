import { useBookingStore } from "@/shared/store/booking/booking";

export const useSelectCso = () => {
  const data = [1, 3, 4];
  const cso = useBookingStore((state) => state.cso);
  const setCso = useBookingStore((state) => state.setCso);

  const availableCso = data.filter((el) => el !== cso);

  const changeCso = (value: number) => {
    setCso(value);
  };

  return { cso, availableCso, changeCso };
};
