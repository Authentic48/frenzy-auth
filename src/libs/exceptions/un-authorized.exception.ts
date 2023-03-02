import { HttpStatus } from '@nestjs/common';
import { RMQError } from 'nestjs-rmq';
import { ERROR_TYPE } from 'nestjs-rmq/dist/constants';

export class UnAuthorizedException extends RMQError {
  constructor(message: string) {
    super(message, ERROR_TYPE.RMQ, HttpStatus.UNAUTHORIZED);
  }
}
