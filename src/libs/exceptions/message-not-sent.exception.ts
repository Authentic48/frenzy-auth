import { HttpException, HttpStatus } from '@nestjs/common';

export class MessageNotSentException extends HttpException {
  constructor() {
    super('Message not sent', HttpStatus.EXPECTATION_FAILED);
  }
}
