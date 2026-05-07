import { useState } from "react";
import styles from "./welcome.module.scss";
import { CsoCard } from "@entities/cso/ui";
import { Button } from "@shared/ui/button";
import { cso } from "./lib";
import { useNavigate } from "react-router-dom";
import { useApiMutation } from "@/shared/lib/hooks/useApiMutation";

export const WelcomeWidget = () => {
  const navigate = useNavigate();

  const login = useApiMutation("auth/login", "post", {onSuccess: () => navigate("/")});

  const handleClick = () => {
    login.mutate({initData: "query_id=AAG-OU5IAgAAAL45Tki7TcpW&user=%7B%22id%22%3A5508053438%2C%22first_name%22%3A%2258%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22Tsdf58%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2Fpw7V2JY02CBKjvDIgotRZnM4mSeIVqLVXSqf9nMv3g2HAkToLUs9S3gVyN4uPfGo.svg%22%7D&auth_date=1765208798&signature=eThqnVjxOi4LH1qDglD2ZWdvx2m4i8cMATpiGeeQS-hRSm9BIzp8p77QIGY7UaxNA4hIrFlqnslV7_DdGja8Cg&hash=c55d09ced4dd2994c54daa721c0e9a22d8997ab89d73f6df3a1949bf1d6bf58e"});
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
