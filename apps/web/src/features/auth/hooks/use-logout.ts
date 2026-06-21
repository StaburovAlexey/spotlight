import { useMutation, useQueryClient } from "@tanstack/react-query";


import { logout } from "../api/auth-api";
import { authQueryKeys } from "../model/auth-query-keys.js";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      return logout();
    },

    onSuccess: async (response) => {
      if (!response.success) {
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: authQueryKeys.me,
      });
    },
  });
}
