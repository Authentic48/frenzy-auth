import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { IAuthService } from './auth';
import { ConfigService } from '@nestjs/config';
import { ArgonService } from '../../libs/services/argon.service';
import { UnAuthorizedException } from '../../libs/exceptions/un-authorized.exception';
import { InternalJWTService } from './jwt/jwt.service';
import { JwtTokenTypes } from '../../libs/utils/enum';
import { OtpExperiedException } from '../../libs/exceptions/otp-experied.exception';
import { SessionService } from '../session/session.service';
import { OtpService } from '../otp/otp.service';
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

    private readonly session: SessionService,

    private readonly otpService: OtpService,
  ) {
    this.VERIFY_OTP_ACCESS_TOKEN_LIFE_TIME = parseInt(
      this.configService.get('VERIFY_OTP_TOKEN_LIFE_TIME'),
    );
  }

  async register(phone: string) {
    const { userUUID, otp } = await this.userService.createUser(phone);

    // TODO: enable twilio service

    // const message = await this.sendOtpService.sendOTP(phone, otp);

    this.logger.debug(`otp successfully sent: ${otp}`);

    const accessToken = await this.jwt.generateToken(
      {
        userUUID,
        type: JwtTokenTypes.VERIFY_OTP_ACCESS_TOKEN,
      },
      this.VERIFY_OTP_ACCESS_TOKEN_LIFE_TIME,
    );

    return {
      accessToken,
    };
  }

  async verifyOTP(userUUID: string, otp: number) {
    const user = await this.userService.findUserByUUID(userUUID);

    if (!user) throw new UnAuthorizedException();

    if (!user.password) throw new OtpExperiedException();

    const isPasswordValid = await this.argon2.compare(
      user.password,
      otp.toString(),
    );

    if (!isPasswordValid) throw new UnAuthorizedException();

    if (!user.isPhoneVerified)
      await this.userService.verifyUserPhoneAndDeleteOTP(user.uuid);

    await this.otpService.deleteOTP(user.uuid);

    const { accessToken, refreshToken, accessTokenUUID, deviceUUID } =
      await this.jwt.generateTokenPair({
        userUUID,
      });

    await this.session.createSession(
      deviceUUID,
      accessTokenUUID,
      refreshToken,
      userUUID,
    );

    return { accessToken, refreshToken };
  }

  async reSendOTP(userUUID: string): Promise<{ success: true }> {
    const { otp } = await this.otpService.createNewOTP(userUUID);

    // const message = await this.sendOtpService.sendOTP(phone, otp);

    this.logger.debug(`otp resent successfully: ${otp}`);

    return { success: true };
  }

  async login(phone: string) {
    const user = await this.userService.findUserByPhone(phone);

    if (!user) throw new UnAuthorizedException();

    const { otp } = await this.otpService.createNewOTP(user.uuid);

    // const message = await this.sendOtpService.sendOTP(phone, otp);

    this.logger.debug(`otp sent successfully: ${otp}`);

    const accessToken = await this.jwt.generateToken(
      {
        userUUID: user.uuid,
        type: JwtTokenTypes.VERIFY_OTP_ACCESS_TOKEN,
      },
      this.VERIFY_OTP_ACCESS_TOKEN_LIFE_TIME,
    );

    return {
      accessToken,
    };
  }
}
