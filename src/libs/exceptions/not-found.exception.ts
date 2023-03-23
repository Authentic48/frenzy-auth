import { HttpStatus } from '@nestjs/common';
import { RMQError } from 'nestjs-rmq';
import { ERROR_TYPE } from 'nestjs-rmq/dist/constants';

export class NotFoundException extends RMQError {
  constructor() {
    super('auth.not_found', ERROR_TYPE.RMQ, HttpStatus.NOT_FOUND);
  }
}
