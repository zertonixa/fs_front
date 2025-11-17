import { useState } from "react";
import styles from "./welcome.module.scss";
import { CsoCard } from "@entities/cso/ui";
import { Button } from "@shared/ui/button";
import { cso } from "./lib";
import { useNavigate } from "react-router-dom";

export const WelcomeWidget = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  const [card, setCard] = useState<number | null>(null);

  return (
    <div className={styles.container}>
      <h1 className={styles.containerTitle}>Добро пожаловать</h1>
      <span className={styles.containerSub}>
        Выберете общежитие, чтобы продолжить
      </span>
      <div className={styles.containerCards}>
        {cso.map((el) => (
          <CsoCard
            key={el.number}
            number={el.number}
            subtitle={el.subtitle}
            onClick={() => setCard(el.number)}
            isActive={card === el.number}
          />
        ))}
      </div>
      <Button
        disabled={card === null}
        text="Продолжить"
        onClick={handleClick}
        backgroundColor="var(--attention)"
        border="1px solid var(--border)"
        borderRadius="10px"
        height="50px"
        width="220px"
      />
    </div>
  );
};
