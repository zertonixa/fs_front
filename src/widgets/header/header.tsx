import styles from "./header.module.scss";
import { SelectCso } from "@features/selectCso/selectCso";
import home from "@shared/assets/home.webp";
import type { HeadersProps } from "./types";
import { Link, useLocation } from "react-router-dom";
import { useApiQuery } from "@/shared/lib/hooks/useApiQuery";
import Settings from "@/shared/assets/settings.svg?react";
import { Logout } from "@/features/logout/ui";
import { Report } from "../reportPopup";

export const Header = ({ title }: HeadersProps) => {
  const { pathname } = useLocation();

  const data = useApiQuery<{
    username: string;
    telegram_id: number;
    id: string;
    is_admin: boolean;
    is_root_admin: boolean;
  }>({ key: ["me"], path: "auth/me" });

  return (
    <div className={styles.container}>
      <div className={styles.containerTitle}>
        {pathname !== "/" && (
          <Link className={styles.containerTitleImage} to={"/"}>
            <img
              src={home}
              alt="home"
              className={styles.containerTitleImageImg}
            />
          </Link>
        )}
        <span className={styles.containerTitleTitle}>{title}</span>
      </div>
      <div className={styles.containerButtons}>
        {data.data?.is_admin && (
          <Link
            type="button"
            to={"/admin"}
            className={styles.containerButtonsAdmin}
          >
            <Settings />
          </Link>
        )}
        <SelectCso />
        <Report />
        <Logout />
      </div>
    </div>
  );
};
