import { HttpStatus } from '@nestjs/common';
import { RMQError } from 'nestjs-rmq';
import { ERROR_TYPE } from 'nestjs-rmq/dist/constants';

export class OtpExperiedException extends RMQError {
  constructor() {
    super('auth.otp_expired', ERROR_TYPE.RMQ, HttpStatus.UNAUTHORIZED);
  }
}
