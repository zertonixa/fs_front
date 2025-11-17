import { Header } from "@/widgets/header";
import styles from "./admin.module.scss";
import { useState } from "react";
import { AdminBar } from "@/widgets/adminBar";
import { AdminUsers } from "@/widgets/adminUsers";

export const AdminPage = () => {
  const [widget, setWidget] = useState<string>("Users");

  return (
    <div className={styles.container}>
      <Header title="Панель администрирования" />
      <div className={styles.containerBody}>
        <AdminBar onClick={setWidget} />
        <AdminUsers />
      </div>
    </div>
  );
};
