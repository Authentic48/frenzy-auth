import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { IUserService } from './user';
import { PrismaService } from '../../prisma/prisma.service';
import { UserAlreadyExistException } from '../../libs/exceptions/user-already-exist.exception';
import { RoleEnum } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { RMQInternalServerError } from '../../libs/exceptions/rmq-internal-server.exception';
import { OtpService } from '../otp/otp.service';

@Injectable()
export class UserService implements IUserService {
  private readonly logger: Logger = new Logger(UserService.name);
  constructor(
    private readonly prisma: PrismaService,

    private readonly configService: ConfigService,

    private readonly otpService: OtpService,
  ) {}
  async createUser(phone: string) {
    try {
      const { password, expiredAt, otp } = await this.otpService.getOtpData();

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
              password,
              expiredAt,
            },
          },
        },
        select: {
          uuid: true,
          phone: true,
        },
      });

      this.logger.debug(
        `New user successfully created, userUUID: ${newUser.uuid}, phone: ${phone} , password: ${otp}`,
      );

      return { userUUID: newUser.uuid, otp };
    } catch (e) {
      this.logger.error(e);
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new UserAlreadyExistException();
      }
      throw new RMQInternalServerError();
    }
  }

  async findUserByUUID(uuid: string) {
    const user = await this.prisma.user.findUnique({
      where: { uuid },
      select: {
        uuid: true,
        phone: true,
        isPhoneVerified: true,
        otp: {
          select: {
            password: true,
          },
        },
      },
    });

    return {
      uuid: user?.uuid,
      phone: user?.phone,
      password: user?.otp?.password,
      isPhoneVerified: user.isPhoneVerified,
    };
  }

  async verifyUserPhoneAndDeleteOTP(userUUID: string): Promise<void> {
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

      this.logger.debug('user phone number verified');
    } catch (e) {
      this.logger.error(e);
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
        // TODO: Change Forbidden Exception to RMQ
        throw new ForbiddenException();
      }
      throw new RMQInternalServerError();
    }
  }

  async findUserByPhone(phone: string) {
    return this.prisma.user.findUnique({
      where: { phone },
    });
  }
}
