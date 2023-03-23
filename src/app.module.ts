import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from './configs/config.schema';
import { getRMQConfig } from './configs/rmq.config';
import { RMQModule } from 'nestjs-rmq';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AutoCleanerModule } from './modules/auto-cleaner/auto-cleaner.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { getRedisConfig } from './configs/redis.config';

@Module({
  imports: [
    RMQModule.forRootAsync(getRMQConfig()),
    ConfigModule.forRoot({ isGlobal: true, validationSchema: configSchema }),
    RedisModule.forRootAsync(getRedisConfig()),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    AutoCleanerModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
