import { RMQError } from 'nestjs-rmq';
import { ERROR_TYPE } from 'nestjs-rmq/dist/constants';
import { HttpStatus } from '@nestjs/common';

export class RMQInternalServerError extends RMQError {
  constructor() {
    super(
      'auth.internal_server_error',
      ERROR_TYPE.RMQ,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
