import { useQuery } from "@tanstack/react-query";
import type { UserDto } from "@music-app/shared";

import { getMe } from "../api/auth-api";
import { authQueryKeys } from "../model/auth-query-keys";

export function useCurrentUser() {
  return useQuery<UserDto | null>({
    queryKey: authQueryKeys.me,
    queryFn: async () => {
      const response = await getMe();

      if (!response.success) {
        return null;
      }

      return response.data;
    },
    retry: false,
  });
}