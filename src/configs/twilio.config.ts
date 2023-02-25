import { ConfigModule, ConfigService } from '@nestjs/config';

export const getTwilioConfig = () => ({
  imports: [ConfigModule],
  inject: [ConfigService],
  // TODO: Add twilio credentials
  useFactory: (configService: ConfigService) => ({
    accountSid: configService.get('TWILIO_ACCOUNT_SID'),
    authToken: configService.get('TWILIO_AUTH_TOKEN'),
  }),
});
