import { HttpStatus } from '@nestjs/common';
import { RMQError } from 'nestjs-rmq';
import { ERROR_TYPE } from 'nestjs-rmq/dist/constants';

export class SessionExpiredException extends RMQError {
  constructor() {
    super(
      'auth.session_expired_or_invalid_refresh_token',
      ERROR_TYPE.RMQ,
      HttpStatus.FORBIDDEN,
    );
  }
}
