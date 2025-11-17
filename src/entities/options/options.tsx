import { useState } from "react";
import styles from "./options.module.scss";
import arrow from "../../shared/assets/arrow.webp";

interface OptionsProps {
  values: number[];
  selected: number;
  onValueChanged: (value: number) => void;
}

export const Options = ({ values, selected, onValueChanged }: OptionsProps) => {
  const [visible, setVisible] = useState<boolean>(false);

  const handleClick = (num: number) => {
    onValueChanged(num);
    setVisible(false);
  };

  return (
    <div className={styles.container} onClick={() => setVisible(!visible)}>
      <div className={styles.containerCard}>
        {`ЦСО №${selected}`}
        <img className={styles.containerCardArrow} src={arrow} alt="arrow" />
      </div>
      {visible && (
        <div className={styles.containerValues}>
          {values.map((el) => (
            <div
              className={styles.containerValuesCard}
              key={el}
              onClick={() => handleClick(el)}
            >
              {`ЦСО №${el}`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
