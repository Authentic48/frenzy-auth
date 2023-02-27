import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { IAuthService } from './auth';
import { ConfigService } from '@nestjs/config';
import { ArgonService } from '../../libs/services/argon.service';
import { UnAuthorizedException } from '../../libs/exceptions/un-authorized.exception';
import { InternalJWTService } from './jwt/jwt.service';
import { JwtTokenTypes } from '../../libs/utils/enum';

// import { SendOtpService } from '../../libs/services/send-otp.service';

@Injectable()
export class AuthService implements IAuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  private readonly VERIFY_OTP_ACCESS_TOKEN_LIFE_TIME: number;

  constructor(
    private readonly userService: UserService,
    // private readonly sendOtpService: SendOtpService,
    private readonly configService: ConfigService,

    private readonly argon2: ArgonService,

    private readonly jwt: InternalJWTService,
  ) {
    this.VERIFY_OTP_ACCESS_TOKEN_LIFE_TIME = parseInt(
      this.configService.get('VERIFY_OTP_TOKEN_LIFE_TIME'),
    );
  }

  async register(phone: string) {
    const { userUUID } = await this.userService.createUser(phone);

    // TODO: enable twilio service

    // const message = await this.sendOtpService.sendOTP(phone);

    this.logger.debug(`otp successfully sent`);

    console.log(this.configService.get('JWT_SECRET'));

    const veryOtpAccessToken = await this.jwt.generateToken(
      {
        userUUID,
        type: JwtTokenTypes.VERIFY_OTP_ACCESS_TOKEN,
      },
      this.VERIFY_OTP_ACCESS_TOKEN_LIFE_TIME,
    );

    return {
      accessToken: veryOtpAccessToken,
    };
  }

  async verifyOTP(phone: string, otp: string) {
    const user = await this.userService.findUserByUUID(phone);

    if (!user) throw new UnAuthorizedException();

    const isPasswordValid = await this.argon2.compare(user.password, otp);

    if (!isPasswordValid) throw new UnAuthorizedException();

    if (!user.isPhoneVerified)
      await this.userService.verifyUserPhoneAndDeleteOTP(user.uuid);

    // TODO generate pair of tokens

    return { success: true };
  }
}
