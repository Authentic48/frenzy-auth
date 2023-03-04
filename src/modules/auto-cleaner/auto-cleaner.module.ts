import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AutoCleanerService } from './auto-cleaner.service';

@Module({
  providers: [PrismaService, AutoCleanerService],
})
export class AutoCleanerModule {}
