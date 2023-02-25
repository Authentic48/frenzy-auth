import { IUser } from '../../libs/interfaces/user.interface';

export interface IUserService {
  createUser(phone: string): Promise<{ success: boolean | null }>;

  findUserByPhone(phone: string): Promise<IUser | null>;

  verifyUserPhone(userUUID: string): Promise<{ success: boolean | null }>;
}
