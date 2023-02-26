import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from './configs/config.schema';
import { getRMQConfig } from './configs/rmq.config';
import { RMQModule } from 'nestjs-rmq';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
// import { TwilioModule } from 'nestjs-twilio';
// import { getTwilioConfig } from './configs/twilio.config';

@Module({
  imports: [
    RMQModule.forRootAsync(getRMQConfig()),
    ConfigModule.forRoot({ isGlobal: true, validationSchema: configSchema }),
    ScheduleModule.forRoot(),
    // TwilioModule.forRootAsync(getTwilioConfig()),
    UserModule,
    AuthModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
