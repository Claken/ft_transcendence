export interface UsersPost {
  id?: number;
  username: string;
  email?: string;
  password: string;
  createdAt?: Date;
  access_token?: string; // ?
}
