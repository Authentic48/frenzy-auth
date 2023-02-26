import { HttpStatus } from '@nestjs/common';
import { RMQError } from 'nestjs-rmq';
import { ERROR_TYPE } from 'nestjs-rmq/dist/constants';

export class UserAlreadyExistException extends RMQError {
  constructor() {
    super('auth.user_already_exist', ERROR_TYPE.RMQ, HttpStatus.FORBIDDEN);
  }
}
