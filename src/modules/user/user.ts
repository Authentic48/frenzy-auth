import { IUser } from '../../libs/interfaces/user.interface';

export interface IUserService {
  createUser(phone: string): Promise<{ userUUID: string | null }>;

  findUserByUUID(uuid: string): Promise<IUser | null>;

  findUserByPhone(uuid: string): Promise<object | null>;

  verifyUserPhoneAndDeleteOTP(
    userUUID: string,
  ): Promise<{ success: boolean | null }>;
}
