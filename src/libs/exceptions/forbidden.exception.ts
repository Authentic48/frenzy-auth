import { HttpStatus } from '@nestjs/common';
import { RMQError } from 'nestjs-rmq';
import { ERROR_TYPE } from 'nestjs-rmq/dist/constants';

export class ForbiddenException extends RMQError {
  constructor() {
    super('auth.forbidden', ERROR_TYPE.RMQ, HttpStatus.FORBIDDEN);
  }
}
