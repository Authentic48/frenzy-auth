import { HttpStatus } from '@nestjs/common';
import { RMQError } from 'nestjs-rmq';
import { ERROR_TYPE } from 'nestjs-rmq/dist/constants';

export class UnAuthorizedException extends RMQError {
  constructor() {
    super('auth.invalid_credentials', ERROR_TYPE.RMQ, HttpStatus.UNAUTHORIZED);
  }
}
