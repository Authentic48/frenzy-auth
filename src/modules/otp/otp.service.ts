import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IOtpService } from './otp';

@Injectable()
export class OtpService implements IOtpService {
  private readonly logger: Logger = new Logger(OtpService.name);
  constructor(private readonly prisma: PrismaService) {}

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
}
