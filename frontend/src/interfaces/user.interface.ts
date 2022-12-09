export class IUser {
  id?: number;
  login?: string;
  name?: string;
  email?: string;
  avatar?: string;
  pictureUrl?: string;
  inQueue: boolean;
  inGame: boolean;
  status?: string;
  twoFASecret?: string;
  isTwoFAEnabled?: boolean;
  isTwoFAValidated?: boolean;
  createdAt?: Date;
  win?: number;
  lose?: number;
}
