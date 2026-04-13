import { Header } from "@/widgets/header";
import styles from "./admin.module.scss";
import { useState } from "react";
import { AdminBar } from "@/widgets/adminBar";
import { AdminUsers } from "@/widgets/adminUsers";
import { AdminSlots } from "@/widgets/adminSlots/adminSlots";
import { AdminHistory } from "@/widgets/adminHistory";
import { AdminReports } from "@/widgets/adminReports";

type AdminWidget = "Users" | "Slots" | "History" | "Reports";

export const AdminPage = () => {
  const [widget, setWidget] = useState<AdminWidget>("Users");

  return (
    <div className={styles.container}>
      <Header title="Панель администрирования" />
      <div className={styles.containerBody}>
        <AdminBar value={widget} onChange={setWidget} />

        {widget === "Users" && <AdminUsers />}
        {widget === "Slots" && <AdminSlots />}
        {widget === "History" && <AdminHistory />}
        {widget === "Reports" && <AdminReports/>}
      </div>
    </div>
  );
};