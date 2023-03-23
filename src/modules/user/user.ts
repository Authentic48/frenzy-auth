import { IUser } from '../../libs/interfaces/user.interface';
import { IUserInfo } from '../../libs/interfaces/user-info.interface';

export interface IUserService {
  createUser(phone: string): Promise<{ userUUID: string; otp: string }>;

  findUserByUUID(uuid: string): Promise<IUser | null>;

  findUserByPhone(uuid: string): Promise<object | null>;

  verifyUserPhone(userUUID: string): Promise<void>;

  getUserInfo(userUUID: string): Promise<IUserInfo | null>;
}
