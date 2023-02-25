import { Injectable, Logger } from '@nestjs/common';
import { IUserService } from './user';
import { PrismaService } from '../../prisma/prisma.service';
import { UserAlreadyExistException } from '../../libs/exceptions/user-already-exist.exception';
import { RoleEnum } from '@prisma/client';
import { ArgonService } from '../../libs/services/argon.service';
import { generateOTP } from '../../libs/helpers/otp-generater.helper';

@Injectable()
export class UserService implements IUserService {
  private readonly logger: Logger = new Logger(UserService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly argon2: ArgonService,
  ) {}
  async createUser(phone: string) {
    try {
      const user = await this.findUserByPhone(phone);

      if (user) {
        throw new UserAlreadyExistException();
      }

      const oTP = generateOTP().toString();

      const password = await this.argon2.hash(oTP);

      const newUser = await this.prisma.user.create({
        data: {
          phone,
          password,
          roles: {
            create: {
              name: RoleEnum.USER,
            },
          },
        },
        select: {
          uuid: true,
          phone: true,
        },
      });

      this.logger.debug(
        `New user successfully created, userUUID: ${newUser.uuid}, phone: ${phone} , password: ${oTP}`,
      );

      return { success: true };
    } catch (e) {
      this.logger.error('Failed to create new user', e.stack);
    }
  }

  async findUserByPhone(phone: string) {
    return this.prisma.user.findUnique({
      where: { phone },
      select: {
        uuid: true,
        phone: true,
        password: true,
      },
    });
  }

  async verifyUserPhone(
    userUUID: string,
  ): Promise<{ success: boolean | null }> {
    try {
      await this.prisma.user.update({
        where: { uuid: userUUID },
        data: {
          isPhoneVerified: true,
        },
      });

      return { success: true };
    } catch (e) {
      this.logger.error(e);
      // TODO Handle error
    }
  }
}
