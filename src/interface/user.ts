export interface User {
  id?: string;
  email?: string;
  userName: string;
  role?: string;
  msKeys?: string;
  department?: string;
  imageName?: string;
  lastAccess?: Date;
  lastPasswordChange?: Date;
}
