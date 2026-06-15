export type ID = string

export type UserRole = 'admin' | 'user'

export type UserStatus = 'active' | 'disabled'

export type UserDto = {
  id: ID
  email: string
  username: string
  displayName: string
  role: UserRole
  status: UserStatus
  mustChangePassword: boolean
}