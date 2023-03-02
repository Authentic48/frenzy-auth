import { SessionService } from '../session/session.service';
import { Controller } from '@nestjs/common';
import { RMQRoute } from 'nestjs-rmq';
import { AuthRouteTopics } from '../../libs/utils/enum';

@Controller()
export class AuthQuery {
  constructor(private readonly session: SessionService) {}

  @RMQRoute(AuthRouteTopics.VERIFY_SESSION)
  verifySession({
    accessTokenUUID,
    deviceUUID,
    userUUID,
  }: {
    accessTokenUUID: string;
    deviceUUID: string;
    userUUID: string;
  }) {
    return this.session.verifySession(deviceUUID, userUUID, accessTokenUUID);
  }
}