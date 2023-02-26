import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { IUserService } from './user';
import { PrismaService } from '../../prisma/prisma.service';
import { UserAlreadyExistException } from '../../libs/exceptions/user-already-exist.exception';
import { RoleEnum } from '@prisma/client';
import { ArgonService } from '../../libs/services/argon.service';
import { generateOTP } from '../../libs/helpers/otp-generater.helper';
import { addMinutes } from '../../libs/helpers/add-minutes.helper';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { RMQInternalServerError } from '../../libs/exceptions/rmq-internal-server.exception';

@Injectable()
export class UserService implements IUserService {
  private readonly logger: Logger = new Logger(UserService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly argon2: ArgonService,

    private readonly configService: ConfigService,
  ) {}
  async createUser(phone: string) {
    try {
      const user = await this.findUserByPhone(phone);

      if (user) {
        throw new UserAlreadyExistException();
      }

      const oTP = generateOTP().toString();

      const newUser = await this.prisma.user.create({
        data: {
          phone,
          roles: {
            create: {
              name: RoleEnum.USER,
            },
          },
          otp: {
            create: {
              password: await this.argon2.hash(oTP),
              expiredAt: addMinutes(
                new Date(),
                this.configService.get('OTP_LIFE_TIME'),
              ),
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
    const user = await this.prisma.user.findUnique({
      where: { phone },
      select: {
        uuid: true,
        phone: true,
        otp: {
          select: {
            password: true,
          },
        },
      },
    });

    return { uuid: user.uuid, phone: user.phone, password: user.otp.password };
  }

  async verifyUserPhoneAndDeleteOTP(
    userUUID: string,
  ): Promise<{ success: boolean | null }> {
    try {
      await this.prisma.user.update({
        where: { uuid: userUUID },
        data: {
          isPhoneVerified: true,
          otp: {
            delete: true,
          },
        },
      });

      return { success: true };
    } catch (e) {
      this.logger.error(e);
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new ForbiddenException();
      }
      throw new RMQInternalServerError();
    }
  }
}
