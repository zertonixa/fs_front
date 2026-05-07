import { useEffect, useMemo, useRef, useState } from "react";
import { UserCard } from "@/entities/adminUsers/ui";
import styles from "./adminUsers.module.scss";
import { useBanUser } from "@/features/userBan/hooks/hooks";
import { useUsers } from "@/entities/adminUsers/hooks";
import { useApiQuery } from "@/shared/lib/hooks/useApiQuery";
import { useAdmin } from "@/features/admin/api";
import { CustomSelect } from "@/shared/ui/select/select";
import type { SortBy, SortOrder } from "@/entities/adminUsers/models";
import { LoadingSpinner } from "@/shared/ui/button/loading/loading";

type BooleanFilter = "all" | "true" | "false";

const bannedOptions: { value: BooleanFilter; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "true", label: "Забаненные" },
  { value: "false", label: "Незабаненные" },
];

const adminOptions: { value: BooleanFilter; label: string }[] = [
  { value: "all", label: "Любая роль" },
  { value: "true", label: "Админ" },
  { value: "false", label: "Пользователь" },
];

const sortByOptions: { value: SortBy; label: string }[] = [
  { value: "created_at", label: "По дате создания" },
  { value: "updated_at", label: "По дате обновления" },
];

const sortOrderOptions: { value: SortOrder; label: string }[] = [
  { value: "desc", label: "Сначала новые" },
  { value: "asc", label: "Сначала старые" },
];

export const AdminUsers = () => {
  const { ban, unban } = useBanUser();
  const { toggleAdmin } = useAdmin();

  const [search, setSearch] = useState("");
  const [isBanned, setIsBanned] = useState<BooleanFilter>("all");
  const [isAdmin, setIsAdmin] = useState<BooleanFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const usersQuery = useUsers({
    name: search || undefined,
    isBanned: isBanned === "all" ? undefined : isBanned === "true",
    isAdmin: isAdmin === "all" ? undefined : isAdmin === "true",
    sortBy,
    sortOrder,
  });

  const admin = useApiQuery<{
    username: string;
    telegram_id: number;
    id: string;
    is_admin: boolean;
    is_root_admin: boolean;
  }>({
    key: ["me"],
    path: "auth/me",
  });

  const listRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const users = useMemo(() => {
    return usersQuery.data?.pages.flatMap((page) => page.items) ?? [];
  }, [usersQuery.data]);

  useEffect(() => {
    const root = listRef.current;
    const target = loadMoreRef.current;

    if (!root || !target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (
          first?.isIntersecting &&
          usersQuery.hasNextPage &&
          !usersQuery.isFetchingNextPage
        ) {
          usersQuery.fetchNextPage();
        }
      },
      {
        root,
        rootMargin: "120px",
        threshold: 0.1,
      }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [
    usersQuery.hasNextPage,
    usersQuery.isFetchingNextPage,
    usersQuery.fetchNextPage,
    users.length,
  ]);

  return (
    <div className={styles.container}>
      <span className={styles.containerTitle}>Пользователи</span>

      <div className={styles.containerFilters}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.containerInput}
          placeholder="Поиск пользователя"
        />

        <CustomSelect
          value={isBanned}
          options={bannedOptions}
          onChange={setIsBanned}
        />

        <CustomSelect
          value={isAdmin}
          options={adminOptions}
          onChange={setIsAdmin}
        />

        <CustomSelect
          value={sortBy}
          options={sortByOptions}
          onChange={setSortBy}
        />

        <CustomSelect
          value={sortOrder}
          options={sortOrderOptions}
          onChange={setSortOrder}
        />
      </div>

      <div ref={listRef} className={styles.containerCards}>
        {usersQuery.isPending && <LoadingSpinner />}

        {usersQuery.isError && (
          <span className={styles.containerState}>Ошибка загрузки пользователей</span>
        )}

        {!usersQuery.isPending && !usersQuery.isError && users.length === 0 && (
          <span className={styles.containerState}>Пользователи не найдены</span>
        )}

        {users.map((el) => (
          <UserCard
            key={el.id}
            id={el.id}
            username={el.username}
            status={el.is_banned}
            is_admin={el.is_admin}
            canChangeAdmin={admin.data?.is_root_admin || false}
            isAdminLoading={toggleAdmin.isPending}
            onToggleAdmin={() => toggleAdmin.mutate({ id: el.id })}
            onBan={() => ban.mutate({ id: el.id })}
            onUnBan={() => unban.mutate({ id: el.id })}
          />
        ))}

        <div ref={loadMoreRef} className={styles.containerLoadMoreTrigger} />

        {usersQuery.isFetchingNextPage && (
          <div className={styles.containerBottomLoader}>
            <LoadingSpinner />
          </div>
        )}

        {!usersQuery.hasNextPage && users.length > 0 && (
          <span className={styles.containerState}>Все пользователи загружены</span>
        )}
      </div>
    </div>
  );
};