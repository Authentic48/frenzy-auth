import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IOtpService } from './otp';
import { ConfigService } from '@nestjs/config';
import { generateOTP } from '../../libs/helpers/otp-generater.helper';
import { addMinutes } from '../../libs/helpers/add-minutes.helper';
import { ArgonService } from '../../libs/services/argon.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UnAuthorizedException } from '../../libs/exceptions/un-authorized.exception';
import { RMQInternalServerError } from '../../libs/exceptions/rmq-internal-server.exception';

@Injectable()
export class OtpService implements IOtpService {
  private readonly logger: Logger = new Logger(OtpService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,

    private readonly argon2: ArgonService,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async deleteExpiredOTP() {
    await this.prisma.otp.deleteMany({
      where: {
        expiredAt: {
          lte: new Date(),
        },
      },
    });

    this.logger.debug('Expired OTP deleted!!');
  }

  async createNewOTP(userUUID: string) {
    try {
      const { password, expiredAt, otp } = await this.getOtpData();

      await this.prisma.otp.upsert({
        where: {
          userUUID,
        },
        update: {
          password,
          expiredAt,
        },
        create: {
          password,
          expiredAt,
          user: {
            connect: {
              uuid: userUUID,
            },
          },
        },
      });

      return { otp };
    } catch (e) {
      this.logger.error(e);
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
        this.logger.debug(
          `Trying to re-send OTP for a user that doesn't exist`,
        );
        throw new UnAuthorizedException();
      }
      throw new RMQInternalServerError();
    }
  }

  async getOtpData(): Promise<{
    password: string;
    expiredAt: Date;
    otp: string;
  }> {
    const otp = generateOTP();

    const password = await this.argon2.hash(otp);

    const expiredAt = addMinutes(
      new Date(),
      this.configService.get('OTP_LIFE_TIME'),
    );

    return { password, expiredAt, otp };
  }

  async deleteOTP(userUUID: string): Promise<void> {
    await this.prisma.otp.delete({
      where: { userUUID },
    });

    this.logger.debug(`OTP deleted after verification!!`);
  }
}
