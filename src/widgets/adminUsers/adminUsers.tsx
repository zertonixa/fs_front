import { UserCard } from "@/entities/adminUsers/ui";
import styles from "./adminUsers.module.scss";
import type { UserCardProps } from "@/entities/adminUsers/ui/types";
import { useBanUser } from "@/features/userBan/hooks/hooks";

const mockUsers: Omit<UserCardProps, "onBan" | "onUnBan">[] = [
  { username: "alex_dev", id: 1, bookingCount: 3, status: true },
  { username: "maria_laundry", id: 2, bookingCount: 1, status: true },
  { username: "oleg_admin", id: 3, bookingCount: 0, status: false },
  { username: "vlad_k", id: 4, bookingCount: 5, status: true },
  { username: "anna142", id: 5, bookingCount: 2, status: true },
  { username: "sergey_qwerty", id: 6, bookingCount: 0, status: false },
  { username: "rustam", id: 7, bookingCount: 4, status: true },
  { username: "daria_fox", id: 8, bookingCount: 1, status: true },
  { username: "ironman", id: 9, bookingCount: 7, status: true },
  { username: "maks_bro", id: 10, bookingCount: 0, status: false },
  { username: "dimon_77", id: 11, bookingCount: 6, status: true },
  { username: "user2003", id: 12, bookingCount: 1, status: true },
  { username: "kira", id: 13, bookingCount: 3, status: true },
  { username: "robot_420", id: 14, bookingCount: 2, status: false },
  { username: "admin_test", id: 15, bookingCount: 10, status: true },
  { username: "yehor", id: 16, bookingCount: 0, status: true },
  { username: "victoria", id: 17, bookingCount: 2, status: true },
  { username: "ilya", id: 18, bookingCount: 5, status: false },
  { username: "coderX", id: 19, bookingCount: 1, status: true },
  { username: "alisa_24", id: 20, bookingCount: 4, status: true },
];

export const AdminUsers = () => {
  const { ban, unban } = useBanUser();

  return (
    <div className={styles.container}>
      <span className={styles.containerTitle}>Пользователи</span>
      <input
        className={styles.containerInput}
        placeholder="Поиск пользователя"
      ></input>
      <div className={styles.containerCards}>
        {mockUsers.map((el) => (
          <UserCard
            id={el.id}
            username={el.username}
            bookingCount={el.bookingCount}
            status={el.status}
            onBan={() => ban.mutate({ id: el.id })}
            onUnBan={() => unban.mutate({ id: el.id })}
          />
        ))}
      </div>
    </div>
  );
};
