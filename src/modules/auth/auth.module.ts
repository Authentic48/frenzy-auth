import { Module } from '@nestjs/common';
import { AuthCommand } from './authCommand';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
// import { SendOtpService } from '../../libs/services/send-otp.service';
import { ArgonService } from '../../libs/services/argon.service';
// import { TwilioService } from 'nestjs-twilio';

@Module({
  imports: [UserModule],
  controllers: [AuthCommand],
  providers: [AuthService, ArgonService],
})
export class AuthModule {}
