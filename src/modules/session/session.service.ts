import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ArgonService } from '../../libs/services/argon.service';

@Injectable()
export class SessionService {
  private readonly logger: Logger = new Logger(SessionService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,

    private readonly argon2: ArgonService,
  ) {}

  async createSession(
    deviceUUID: string,
    accessTokenUUID: string,
    refreshToken: string,
    userUUID: string,
  ) {
    const sessions = await this.prisma.session.findMany({
      where: { userUUID },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (
      sessions.length < parseInt(this.configService.get('USER_SESSION_LIMIT'))
    ) {
      await this.createNewSession(
        deviceUUID,
        accessTokenUUID,
        refreshToken,
        userUUID,
      );
      this.logger.debug(
        `Session limit not reached, new session created for user: ${userUUID}`,
      );

      return;
    }

    this.logger.debug(
      `Session limit  reached, need to delete oldest session for user: ${userUUID}`,
    );
    await this.prisma.session.delete({
      where: { uuid: sessions[0].uuid },
    });
    await this.createNewSession(
      deviceUUID,
      accessTokenUUID,
      refreshToken,
      userUUID,
    );

    this.logger.debug(
      `Oldest session deleted  and new session created for user: ${userUUID}`,
    );

    return;
  }

  async createNewSession(
    deviceUUID: string,
    accessTokenUUID: string,
    refreshToken: string,
    userUUID: string,
  ) {
    const { accessExpiredAt, refreshExpiredAt } = this.getPairExpirationDates();

    const hashedRefreshToken = await this.getHashedRefreshToken(refreshToken);

    await this.prisma.session.create({
      data: {
        deviceUUID,
        refreshToken: hashedRefreshToken,
        userUUID,
        expiredAt: refreshExpiredAt,
        tokens: {
          create: {
            accessTokenUUID,
            expiredAt: accessExpiredAt,
          },
        },
      },
    });
  }

  async getHashedRefreshToken(refreshToken: string) {
    return this.argon2.hash(refreshToken);
  }

  getPairExpirationDates() {
    const currentTime = new Date();

    const accessExpiredAt = new Date(
      currentTime.getTime() +
        parseInt(this.configService.get('ACCESS_TOKEN_LIFE_TIME')) * 1000,
    );
    const refreshExpiredAt = new Date(
      currentTime.getTime() +
        parseInt(this.configService.get('REFRESH_TOKEN_LIFE_TIME')) * 1000,
    );

    return { accessExpiredAt, refreshExpiredAt };
  }

  async deleteSession(deviceUUID: string): Promise<{ success: boolean }> {
    await this.prisma.session.delete({
      where: { deviceUUID },
    });

    return { success: true };
  }

  async verifySession(
    deviceUUID: string,
    userUUID: string,
    accessTokenUUID: string,
  ) {
    const session = await this.prisma.session.findFirst({
      where: { deviceUUID, userUUID },
      select: {
        tokens: {
          select: {
            accessTokenUUID: true,
          },
        },
      },
    });

    if (!session || session.tokens[0].accessTokenUUID !== accessTokenUUID) {
      this.logger.debug(`Invalid session access token!!`);
      return { success: false };
    }

    return { success: true };
  }
}
