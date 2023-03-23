import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ArgonService } from '../../libs/services/argon.service';

@Module({
  providers: [OtpService, PrismaService, ArgonService],
  exports: [OtpService],
})
export class OtpModule {}
