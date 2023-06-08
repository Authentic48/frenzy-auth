import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { IAuthService } from './auth';
import { ConfigService } from '@nestjs/config';
import { ArgonService } from '../../libs/services/argon.service';
import { UnAuthorizedException } from '../../libs/exceptions/un-authorized.exception';
import { InternalJWTService } from './jwt/jwt.service';
import { JwtTokenTypes } from '@tintok/tintok-common';
import { OtpExpiredException } from '../../libs/exceptions/otp-experied.exception';
import { SessionService } from '../session/session.service';
import { OtpService } from '../otp/otp.service';
import { SessionExpiredException } from '../../libs/exceptions/session-expired.exception';
import { randomUUID } from 'crypto';
import { RedisService } from '../../libs/services/redis.service';
// import { SendOtpService } from '../../libs/services/send-otp.service';

@Injectable()
export class AuthService implements IAuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  private readonly VERIFY_OTP_ACCESS_TOKEN_LIFE_TIME: number;

  constructor(
    private readonly userService: UserService,
    // TODO: Integrate later
    // private readonly sendOtpService: SendOtpService,
    private readonly configService: ConfigService,

    private readonly argon2: ArgonService,

    private readonly jwt: InternalJWTService,

    private readonly session: SessionService,

    private readonly otpService: OtpService,

    private readonly redis: RedisService,
  ) {
    this.VERIFY_OTP_ACCESS_TOKEN_LIFE_TIME = parseInt(
      this.configService.get('VERIFY_OTP_TOKEN_LIFE_TIME'),
    );
  }

  async refresh(
    deviceUUID: string,
    userUUID: string,
    incomingRefreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { isRefreshTokenValid } =
      await this.session.verifySessionRefreshToken(
        incomingRefreshToken,
        deviceUUID,
        userUUID,
      );

    if (!isRefreshTokenValid) {
      throw new SessionExpiredException();
    }

    const { accessToken, refreshToken, accessTokenUUID } =
      await this.jwt.generateTokenPair(
        {
          userUUID,
        },
        deviceUUID,
      );

    await this.session.updateSession(
      refreshToken,
      deviceUUID,
      userUUID,
      accessTokenUUID,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(phone: string) {
    const { userUUID, otp } = await this.userService.createUser(phone);

    // TODO: enable twilio service

    // const message = await this.sendOtpService.sendOTP(phone, otp);

    this.logger.debug(`otp successfully sent: ${otp}`);

    const verifyOTPToken = await this.jwt.generateToken(
      {
        userUUID,
        type: JwtTokenTypes.VERIFY_OTP_ACCESS_TOKEN,
      },
      this.VERIFY_OTP_ACCESS_TOKEN_LIFE_TIME,
    );

    await this.redis.set(userUUID, verifyOTPToken);

    return {
      verifyOTPToken,
    };
  }

  async verifyOTP(userUUID: string, otp: number) {
    const user = await this.userService.findUserByUUID(userUUID);

    if (!user) throw new UnAuthorizedException('auth.invalid_credentials');

    if (!user.password) throw new OtpExpiredException();

    const isPasswordValid = await this.argon2.compare(
      user.password,
      otp.toString(),
    );

    if (!isPasswordValid)
      throw new UnAuthorizedException('auth.invalid_credentials');

    if (!user.isPhoneVerified)
      await this.userService.verifyUserPhone(user.uuid);

    await this.otpService.deleteOTP(user.uuid);

    await this.redis.delete(userUUID);

    const deviceUUID = randomUUID();

    const { accessToken, refreshToken, accessTokenUUID } =
      await this.jwt.generateTokenPair(
        {
          userUUID,
        },
        deviceUUID,
      );

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

    if (!user) throw new UnAuthorizedException('auth.invalid_credentials');

    const { otp } = await this.otpService.createNewOTP(user.uuid);

    // const message = await this.sendOtpService.sendOTP(phone, otp);

    this.logger.debug(`otp sent successfully: ${otp}`);

    const verifyOTPToken = await this.jwt.generateToken(
      {
        userUUID: user.uuid,
        type: JwtTokenTypes.VERIFY_OTP_ACCESS_TOKEN,
      },
      this.VERIFY_OTP_ACCESS_TOKEN_LIFE_TIME,
    );

    await this.redis.set(user.uuid, verifyOTPToken);

    return {
      verifyOTPToken,
    };
  }

  async logout(deviceUUID: string): Promise<{ success: boolean }> {
    return await this.session.deleteSession(deviceUUID);
  }
}
