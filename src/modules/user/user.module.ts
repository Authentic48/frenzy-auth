import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ArgonService } from '../../libs/services/argon.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, ArgonService],
  exports: [UserService],
})
export class UserModule {}
