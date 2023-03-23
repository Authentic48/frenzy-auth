import { RedisModuleAsyncOptions } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const getRedisConfig = (): RedisModuleAsyncOptions => ({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    config: {
      host: configService.get('REDIS_HOST'),
      port: Number(configService.get('REDIS_PORT')),
      password: configService.get('REDIS_PASSWORD'),
      db: Number(configService.get('REDIS_MAIN_DB')),
    },
  }),
});
