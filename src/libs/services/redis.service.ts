import { Injectable, Logger } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  private readonly logger: Logger = new Logger(RedisService.name);
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly configService: ConfigService,
  ) {}

  getVerifyOTPAccessTokenKey(userUUID: string) {
    return `verify-otp-access-token-${userUUID}`;
  }

  async set(userUUID: string, token: string) {
    await this.redis.set(
      this.getVerifyOTPAccessTokenKey(userUUID),
      token,
      'EX',
      this.configService.get('VERIFY_OTP_TOKEN_LIFE_TIME'),
    );

    this.logger.debug(
      `Verify OTP access token key: ${this.getVerifyOTPAccessTokenKey(
        userUUID,
      )} added to Redis`,
    );
  }

  async delete(userUUID: string) {
    await this.redis.del(this.getVerifyOTPAccessTokenKey(userUUID));

    this.logger.debug(
      `Verify OTP access token key: ${this.getVerifyOTPAccessTokenKey(
        userUUID,
      )} remove from Redis`,
    );
  }
}
