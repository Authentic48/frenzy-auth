import { Status } from '@prisma/client';

export interface IUserInfo {
  userUUID: string;

  roles: string[];

  status: Status;

  isPhoneVerified: boolean;
}
