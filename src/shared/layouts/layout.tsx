import { useEffect, useMemo, useState, type ReactNode } from "react";
import styles from "./layout.module.scss";
import { useApiMutation } from "../lib/hooks/useApiMutation";
import { useNavigate } from "react-router-dom";
import { useApiQuery } from "../lib/hooks/useApiQuery";

interface LayoutProps {
  children: ReactNode;
}

const DEV_INIT_DATA =
  "query_id=AAG-OU5IAgAAAL45TkjDdpgh&user=%7B%22id%22%3A5508053438%2C%22first_name%22%3A%2258%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22Tsdf58%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2Fpw7V2JY02CBKjvDIgotRZnM4mSeIVqLVXSqf9nMv3g2HAkToLUs9S3gVyN4uPfGo.svg%22%7D&auth_date=1772124738&signature=GBX8uRPToEQtMevmVLu3FAFpDYhQAYN7MEfMAgEhaYPZSiWZAumUbq9wjYj_p5EaQSlUkSiVkp98G5nhy-3-CQ&hash=b23736780a42e17d4523b73d611c9e9542d35fa1b06dee805afcfd09511b94d0";

const IS_DEV = true;

export const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const [bootstrapped, setBootstrapped] = useState(false);

  const initData = useMemo(() => {
    if (IS_DEV) return DEV_INIT_DATA;

    if (typeof window === "undefined") return null;

    // @ts-ignore
    const tg = window.Telegram?.WebApp;
    return tg?.initData ?? null;
  }, []);

  const login = useApiMutation("auth/login", "post", {
    onSuccess: async () => {
      const res = await me.refetch();
      const status = (res.error as any)?.response?.status ?? (res.error as any)?.status;

      if (status === 403) {
        navigate("/ban");
        return;
      }

      if (!res.error) {
        setBootstrapped(true);
      }
    },
    onError: (e: any) => {
      const status = e?.response?.status ?? e?.status;

      if (status === 403) {
        navigate("/ban");
        return;
      }

      console.log("login error", e);
    },
  });

  const me = useApiQuery<{ username: string; telegram_id: number; id: string }>({
    key: ["me"],
    path: "auth/me",
    enabled: false,
  });

  useEffect(() => {
    if (!initData) {
      console.log("initData missing");
      return;
    }

    const run = async () => {
      const meRes = await me.refetch();
      const status =
        (meRes.error as any)?.response?.status ?? (meRes.error as any)?.status;

      if (status === 403) {
        navigate("/ban");
        return;
      }

      if (status === 401) {
        login.mutate({ initData });
        return;
      }

      if (!meRes.error) {
        setBootstrapped(true);
      }
    };

    run();
  }, [initData]);

  return (
    <div className={`${styles.container} theme-root`}>
      {bootstrapped ? children : null}
    </div>
  );
};