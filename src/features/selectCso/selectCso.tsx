import { Options } from "../../entities/options";
import { useSelectCso } from "./hooks";

export const SelectCso = () => {
  const { cso, availableCso, changeCso } = useSelectCso();

  return (
    <Options values={availableCso} selected={cso} onValueChanged={changeCso} />
  );
};
