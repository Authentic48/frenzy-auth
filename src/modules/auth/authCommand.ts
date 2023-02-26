import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RMQRoute } from 'nestjs-rmq';
import { AuthRouteTopics } from '../../libs/utils/enum';

@Controller()
export class AuthCommand {
  constructor(private readonly authService: AuthService) {}

  @RMQRoute(AuthRouteTopics.REGISTER)
  async register(phone: string): Promise<{ success: boolean | null }> {
    return this.authService.register(phone);
  }

  @RMQRoute(AuthRouteTopics.REGISTER_VERIFY_OTP)
  async verifyOTP({ phone, otp }: { phone: string; otp: string }) {
    return this.authService.verifyOTP(phone, otp);
  }
}
