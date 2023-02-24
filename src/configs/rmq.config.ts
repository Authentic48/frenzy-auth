import { IRMQServiceAsyncOptions } from 'nestjs-rmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const getRMQConfig = (): IRMQServiceAsyncOptions => ({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    serviceName: configService.get('APP_NAME'),
    exchangeName: configService.get('EXCHANGE'),
    prefetchCount: parseInt(configService.get('RMQ_PREFETCH_COUNT')),
    queueName: configService.get('APP_NAME'),
    logMessages: process.env.NODE_ENV === 'development',
    connections: [
      {
        login: configService.get('RMQ_USER'),
        password: configService.get('RMQ_PASSWORD'),
        host: configService.get('RMQ_HOST'),
        port: parseInt(configService.get('RMQ_PORT')),
      },
    ],
  }),
});
