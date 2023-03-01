import { Module } from '@nestjs/common';
import { AuthCommand } from './auth.command';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { SendOtpService } from '../../libs/services/send-otp.service';
import { ArgonService } from '../../libs/services/argon.service';
import { TwilioModule } from 'nestjs-twilio';
import { getTwilioConfig } from '../../configs/twilio.config';
import { InternalJWTService } from './jwt/jwt.service';
import { getJwtConfig } from '../../configs/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { SessionModule } from '../session/session.module';
import { OtpModule } from '../otp/otp.module';

@Module({
  imports: [
    JwtModule.registerAsync(getJwtConfig()),
    UserModule,
    TwilioModule.forRootAsync(getTwilioConfig()),
    SessionModule,
    OtpModule,
  ],
  controllers: [AuthCommand],
  providers: [SendOtpService, InternalJWTService, AuthService, ArgonService],
})
export class AuthModule {}
