

export type UserRole = "ADMIN" | "USER";
export type UserStatus = "ACTIVE" | "DISABLED";

export type UserDto = {
  id: string;
  email: string;
  username: string;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  mustChangePassword: boolean;
};
