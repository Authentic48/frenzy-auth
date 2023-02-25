import {
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { TwilioService } from 'nestjs-twilio';
import { UserService } from '../user/user.service';
import { IAuthService } from './auth';
import { RMQError } from 'nestjs-rmq';
import { ERROR_TYPE } from 'nestjs-rmq/dist/constants';
import { ConfigService } from '@nestjs/config';
import { MessageNotSentException } from '../../libs/exceptions/message-not-sent.exception';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';
import { ArgonService } from '../../libs/services/argon.service';

@Injectable()
export class AuthService implements IAuthService {
  private readonly logger: Logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly twilioService: TwilioService,
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

    const message = await this.sendOTP(phone);

    if (!message) throw new MessageNotSentException();

    this.logger.debug(`otp successfully sent: ${message.sid}`);

    return { success };
  }

  async registerVerifyOTP(phone: string, otp: string) {
    const user = await this.userService.findUserByPhone(phone);

    if (!user)
      throw new UnauthorizedException('auth.invalid_code_or_phone_number');

    const isPasswordValid = await this.argon2.compare(user.password, otp);

    if (!isPasswordValid) throw new UnauthorizedException('auth.invalid_code');

    await this.userService.verifyUserPhone(user.uuid);

    // TODO generate pair of tokens
  }

  login(phone: string) {}

  loginVerifyOTP(phone: string, password: string) {}

  logout(deviceUUID: string) {}

  async sendOTP(phone: string): Promise<MessageInstance | null> {
    try {
      return await this.twilioService.client.messages.create({
        from: this.configService.get(''),
        to: phone,
        body: ``,
      });
    } catch (e) {
      this.logger.error(`failed to sent message`, e.stack);
    }
  }
}
