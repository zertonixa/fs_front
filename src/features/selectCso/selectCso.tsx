import { Options } from "../../entities/options";
import { useSelectCso } from "./hooks";

export const SelectCso = () => {
  const { currentCso, availableCso, changeCso } = useSelectCso();

  return (
    <Options
      values={availableCso}
      selected={currentCso}
      onValueChanged={changeCso}
    />
  );
};
