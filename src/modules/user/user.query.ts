import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { IUserInfo } from '@tintok/tintok-common';
import { RMQRoute } from 'nestjs-rmq';
import { AuthRouteTopics } from '@tintok/tintok-common';

@Controller()
export class UserQuery {
  constructor(private readonly userService: UserService) {}

  @RMQRoute(AuthRouteTopics.GET_USER_INFO)
  async getUserInfo(userUUID: string): Promise<IUserInfo | null> {
    return this.userService.getUserInfo(userUUID);
  }
}
