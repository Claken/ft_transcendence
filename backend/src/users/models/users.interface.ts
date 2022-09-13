export interface IUser {
  id?: number;
  username: string;
  emails?: string;
  profileUrl: string;
  createdAt?: Date;
  // accessToken?: string; // ?
}
