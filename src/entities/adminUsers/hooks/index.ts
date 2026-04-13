import { useInfiniteQuery } from "@tanstack/react-query";
import { useApiQuery } from "@/shared/lib/hooks/useApiQuery";
import { axiosInstance } from "@/shared/lib/api/axios";
import type {
  BanResponse,
  PaginatedUsersResponse,
  SortBy,
  SortOrder,
} from "../models";

type UseUsersParams = {
  name?: string;
  isBanned?: boolean;
  isAdmin?: boolean;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
};

const PER_PAGE = 20;

export const useUsers = ({
  name,
  isBanned,
  isAdmin,
  sortBy,
  sortOrder,
}: UseUsersParams = {}) => {
  return useInfiniteQuery({
    queryKey: [
      "users",
      {
        name: name ?? null,
        is_banned: isBanned ?? null,
        is_admin: isAdmin ?? null,
        sort_by: sortBy ?? null,
        sort_order: sortOrder ?? null,
      },
    ],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const response = await axiosInstance.get<PaginatedUsersResponse>("users", {
        params: {
          page: pageParam,
          per_page: PER_PAGE,
          ...(name ? { name } : {}),
          ...(isBanned !== undefined ? { is_banned: isBanned } : {}),
          ...(isAdmin !== undefined ? { is_admin: isAdmin } : {}),
          ...(sortBy !== undefined ? { sort_by: sortBy } : {}),
          ...(sortOrder !== undefined ? { sort_order: sortOrder } : {}),
        },
      });

      return response.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.has_next ? lastPage.page + 1 : undefined;
    },
  });
};

export const useBanResponse = () => {
  return useApiQuery<BanResponse>({
    key: ["ban/me"],
    path: "users/ban",
  });
};