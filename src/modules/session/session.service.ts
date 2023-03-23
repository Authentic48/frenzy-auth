import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ArgonService } from '../../libs/services/argon.service';
import { ISessionService } from './session';

@Injectable()
export class SessionService implements ISessionService {
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
        sessionAccessToken: {
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

  async verifySessionAccessToken(
    deviceUUID: string,
    userUUID: string,
    accessTokenUUID: string,
  ): Promise<{ success: boolean }> {
    const session = await this.prisma.session.findFirst({
      where: { deviceUUID, userUUID },
      select: {
        sessionAccessToken: true,
      },
    });

    if (
      !session ||
      session.sessionAccessToken.accessTokenUUID !== accessTokenUUID
    ) {
      this.logger.debug(`Invalid session access token!!`);
      return { success: false };
    }

    return { success: true };
  }

  async verifySessionRefreshToken(
    refreshToken: string,
    deviceUUID: string,
    userUUID: string,
  ): Promise<{ isRefreshTokenValid: boolean }> {
    const session = await this.prisma.session.findFirst({
      where: { deviceUUID, userUUID },
      select: {
        refreshToken: true,
      },
    });

    if (!session) {
      return { isRefreshTokenValid: false };
    }

    const isRefreshTokenCorrect = await this.argon2.compare(
      session.refreshToken,
      refreshToken,
    );

    if (!isRefreshTokenCorrect) {
      return { isRefreshTokenValid: false };
    }

    return { isRefreshTokenValid: true };
  }

  async updateSession(
    refreshToken: string,
    deviceUUID: string,
    userUUID: string,
    accessTokenUUID: string,
  ): Promise<void> {
    const { accessExpiredAt, refreshExpiredAt } = this.getPairExpirationDates();

    const hashedRefreshToken = await this.getHashedRefreshToken(refreshToken);

    const session = await this.prisma.session.update({
      where: { deviceUUID },
      data: {
        refreshToken: hashedRefreshToken,
        expiredAt: refreshExpiredAt,
      },
      select: {
        uuid: true,
      },
    });

    this.logger.debug(`Session updated for device: ${deviceUUID}`);

    await this.prisma.sessionAccessToken.upsert({
      where: { sessionUUID: session.uuid },
      update: {
        accessTokenUUID,
        expiredAt: accessExpiredAt,
      },
      create: {
        accessTokenUUID,
        expiredAt: accessExpiredAt,
        sessionUUID: session.uuid,
      },
    });

    this.logger.debug(
      `New session access token created for device: ${deviceUUID}`,
    );
  }
}
