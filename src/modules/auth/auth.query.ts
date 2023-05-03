import { SessionService } from '../session/session.service';
import { Controller } from '@nestjs/common';
import { RMQRoute } from 'nestjs-rmq';
import { EAuthRouteTopics } from '@tintok/tintok-common';

@Controller()
export class AuthQuery {
  constructor(private readonly session: SessionService) {}

  @RMQRoute(EAuthRouteTopics.VERIFY_SESSION)
  verifySessionAccessToken({
    accessTokenUUID,
    deviceUUID,
    userUUID,
  }: {
    accessTokenUUID: string;
    deviceUUID: string;
    userUUID: string;
  }) {
    return this.session.verifySessionAccessToken(
      deviceUUID,
      userUUID,
      accessTokenUUID,
    );
  }
}
