import {
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { IAuthService } from './auth';
import { RMQError } from 'nestjs-rmq';
import { ERROR_TYPE } from 'nestjs-rmq/dist/constants';
import { ConfigService } from '@nestjs/config';
import { ArgonService } from '../../libs/services/argon.service';
// import { MessageNotSentException } from '../../libs/exceptions/message-not-sent.exception';
// import { SendOtpService } from '../../libs/services/send-otp.service';

@Injectable()
export class AuthService implements IAuthService {
  private readonly logger: Logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    // private readonly sendOtpService: SendOtpService,
    private readonly configService: ConfigService,

    private readonly argon2: ArgonService,
  ) {}

  async register(phone: string) {
    const { success } = await this.userService.createUser(phone);

    if (!success)
      throw new RMQError(
        'auth.create_user_failed',
        ERROR_TYPE.RMQ,
        HttpStatus.EXPECTATION_FAILED,
      );

    // TODO: enable twilio service

    // const message = await this.sendOtpService.sendOTP(phone);
    //
    // if (!message) throw new MessageNotSentException();

    this.logger.debug(`otp successfully sent: `);

    return { success };
  }

  async verifyOTP(phone: string, otp: string) {
    const user = await this.userService.findUserByPhone(phone);

    if (!user)
      throw new UnauthorizedException('auth.invalid_code_or_phone_number');

    const isPasswordValid = await this.argon2.compare(user.password, otp);

    if (!isPasswordValid) throw new UnauthorizedException('auth.invalid_code');

    await this.userService.verifyUserPhoneAndDeleteOTP(user.uuid);

    // TODO generate pair of tokens
  }
}
