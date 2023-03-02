import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RMQRoute } from 'nestjs-rmq';
import { AuthRouteTopics } from '../../libs/utils/enum';

@Controller()
export class AuthCommand {
  constructor(private readonly authService: AuthService) {}

  @RMQRoute(AuthRouteTopics.REGISTER)
  async register(phone: string) {
    return this.authService.register(phone);
  }

  @RMQRoute(AuthRouteTopics.REGISTER_VERIFY_OTP)
  async verifyOTP({ userUUID, otp }: { userUUID: string; otp: number }) {
    return this.authService.verifyOTP(userUUID, otp);
  }

  @RMQRoute(AuthRouteTopics.RE_SEND_OTP)
  async reSendOTP({ userUUID }: { userUUID: string }) {
    return this.authService.reSendOTP(userUUID);
  }

  @RMQRoute(AuthRouteTopics.LOGIN)
  async login(phone: string) {
    return this.authService.login(phone);
  }

  @RMQRoute(AuthRouteTopics.LOGOUT)
  async logout(deviceUUID: string) {
    return this.authService.logout(deviceUUID);
  }
}
