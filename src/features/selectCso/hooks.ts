import { useState } from "react";

export const useSelectCso = () => {
  const data = [1, 3, 4];
  const [currentCso, setCurrentCso] = useState<number>(4);

  const availableCso = data.filter((el) => el !== currentCso);

  const changeCso = (value: number) => {
    setCurrentCso(value);
  };

  return { currentCso, availableCso, changeCso };
};
