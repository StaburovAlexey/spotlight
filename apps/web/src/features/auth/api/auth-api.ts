import { apiClient } from "../../../shared/api/clientFetch";
import type { LoginRequest, UserDto } from "@music-app/shared";
export async function login(body: LoginRequest) {
  return apiClient<UserDto, LoginRequest>("/api/auth/login", {
    method: "POST",
    body,
  });
}

export async function getMe() {
  return apiClient<UserDto>("/api/auth/me");
}

export async function logout() {
  return apiClient<{ ok: true }>("/api/auth/logout", { method: "POST" });
}
