import { TwilioService } from 'nestjs-twilio';
import { Injectable, Logger } from '@nestjs/common';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';
import { ConfigService } from '@nestjs/config';
import { MessageNotSentException } from '../exceptions/message-not-sent.exception';

@Injectable()
export class SendOtpService {
  private readonly logger: Logger = new Logger(SendOtpService.name);
  constructor(
    private readonly twilioService: TwilioService,
    private readonly configService: ConfigService,
  ) {}

  async sendOTP(phone: string, otp: number): Promise<MessageInstance | null> {
    try {
      return await this.twilioService.client.messages.create({
        from: this.configService.get('TWILIO_PHONE_NUMBER'),
        to: phone,
        body: `Do not share this pass code: ${otp}`,
      });
    } catch (e) {
      this.logger.error(`failed to sent message`, e.stack);
      throw new MessageNotSentException();
    }
  }
}
