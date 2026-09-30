export type UserRole = 'ADMIN' | 'TENANT';

export interface AuthUser {
  id: string;
  username: string;
  role: UserRole;
}
