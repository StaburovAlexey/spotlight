
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LoginRequest } from "@music-app/shared";

import { login } from "../api/auth-api";
import { authQueryKeys } from "../model/auth-query-keys.js";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: LoginRequest) => {
      return login(body);
    },

    onSuccess: async (response) => {
      if (!response.success) {
        return;
      }

      await queryClient.refetchQueries({
        queryKey: authQueryKeys.me,
      });
    },
  });
}
