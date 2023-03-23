import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AutoCleanerService {
  private readonly logger: Logger = new Logger(AutoCleanerService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
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

  @Cron(CronExpression.EVERY_MINUTE)
  async deleteExpiredSessionAndAccessToken() {
    const expiredSessionAccessTokens =
      this.prisma.sessionAccessToken.deleteMany({
        where: {
          expiredAt: {
            lte: new Date(),
          },
        },
      });

    const expiredSessions = this.prisma.session.deleteMany({
      where: {
        expiredAt: {
          lte: new Date(),
        },
      },
    });

    await this.prisma.$transaction([
      expiredSessionAccessTokens,
      expiredSessions,
    ]);

    this.logger.debug('Expired sessions and session access tokens deleted!!');
  }
}
