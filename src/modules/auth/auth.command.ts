import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RMQRoute } from 'nestjs-rmq';
import { EAuthRouteTopics } from '@tintok/tintok-common';

@Controller()
export class AuthCommand {
  constructor(private readonly authService: AuthService) {}

  @RMQRoute(EAuthRouteTopics.REGISTER)
  async register(phone: string) {
    return this.authService.register(phone);
  }

  @RMQRoute(EAuthRouteTopics.REGISTER_VERIFY_OTP)
  async verifyOTP({ userUUID, otp }: { userUUID: string; otp: number }) {
    return this.authService.verifyOTP(userUUID, otp);
  }

  @RMQRoute(EAuthRouteTopics.RE_SEND_OTP)
  async reSendOTP({ userUUID }: { userUUID: string }) {
    return this.authService.reSendOTP(userUUID);
  }

  @RMQRoute(EAuthRouteTopics.LOGIN)
  async login(phone: string) {
    return this.authService.login(phone);
  }

  @RMQRoute(EAuthRouteTopics.LOGOUT)
  async logout(deviceUUID: string) {
    return this.authService.logout(deviceUUID);
  }

  @RMQRoute(EAuthRouteTopics.REFRESH)
  async refresh({
    deviceUUID,
    userUUID,
    refreshToken,
  }: {
    deviceUUID: string;
    userUUID: string;
    refreshToken: string;
  }) {
    return this.authService.refresh(deviceUUID, userUUID, refreshToken);
  }
}
