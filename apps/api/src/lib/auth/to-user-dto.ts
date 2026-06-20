import type { User } from "../../generated/prisma/client.js";
import type { UserDto } from "@music-app/shared";
export function toUserDto(user: User): UserDto {
  const { id, email, username, displayName, role, status, mustChangePassword } =
    user;
  return { id, email, username, displayName, role, status, mustChangePassword };
}
