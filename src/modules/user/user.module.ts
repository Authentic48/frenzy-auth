import { Module } from '@nestjs/common';
import { UserQuery } from './user.query';
import { UserService } from './user.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ArgonService } from '../../libs/services/argon.service';
import { ConfigService } from '@nestjs/config';
import { OtpModule } from '../otp/otp.module';

@Module({
  imports: [OtpModule],
  controllers: [UserQuery],
  providers: [UserService, PrismaService, ArgonService, ConfigService],
  exports: [UserService],
})
export class UserModule {}
