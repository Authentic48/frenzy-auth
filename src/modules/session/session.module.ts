import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ArgonService } from '../../libs/services/argon.service';

@Module({
  providers: [SessionService, PrismaService, ArgonService],
  exports: [SessionService],
})
export class SessionModule {}
