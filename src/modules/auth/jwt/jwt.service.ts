import { JwtService } from '@nestjs/jwt';
import { IJWTPayload } from '../../../libs/interfaces/payload.interface';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { JwtTokenTypes } from '../../../libs/utils/enum';

@Injectable()
export class InternalJWTService {
  constructor(
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateToken(payload: IJWTPayload, lifeTime: number) {
    return this.jwt.signAsync(payload, { expiresIn: lifeTime });
  }

  async generateTokenPair(
    payload: IJWTPayload,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const deviceUUID = randomUUID();

    const accessToken = await this.generateToken(
      { deviceUUID, type: JwtTokenTypes.ACCESS_TOKEN, ...payload },
      parseInt(this.configService.get('ACCESS_TOKEN_LIFE_TIME')),
    );

    const refreshToken = await this.generateToken(
      { deviceUUID, type: JwtTokenTypes.REFRESH_TOKEN, ...payload },
      parseInt(this.configService.get('REFRESH_TOKEN_LIFE_TIME')),
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
