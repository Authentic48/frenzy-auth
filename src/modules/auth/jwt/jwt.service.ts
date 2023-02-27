import { JwtService } from '@nestjs/jwt';
import { IJWTPayload } from '../../../libs/interfaces/payload.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InternalJWTService {
  constructor(private readonly jwt: JwtService) {}

  async generateToken(payload: IJWTPayload, lifeTime: number) {
    return this.jwt.signAsync(payload, { expiresIn: lifeTime });
  }
}
