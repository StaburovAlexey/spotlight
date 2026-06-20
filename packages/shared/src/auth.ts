import type { ApiResponse, ApiSuccessResponse } from "./api.js";
import type { UserDto } from "./user.js";

export type LoginRequest = {
  login: string;
  password: string;
};

export type LoginResponse = ApiResponse<UserDto>;

export type MeResponse = ApiResponse<UserDto>;

export type LogoutResponse = ApiSuccessResponse<{
  ok: true;
}>;
