import { HttpStatus } from '@nestjs/common';
import { RMQError } from 'nestjs-rmq';
import { ERROR_TYPE } from 'nestjs-rmq/dist/constants';

export class MessageNotSentException extends RMQError {
  constructor() {
    super('auth.otp_not_sent', ERROR_TYPE.RMQ, HttpStatus.EXPECTATION_FAILED);
  }
}
