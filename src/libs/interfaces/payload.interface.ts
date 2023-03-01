import { JwtTokenTypes } from '../utils/enum';

export interface IJWTPayload {
  userUUID: string;
  type?: JwtTokenTypes;

  deviceUUID?: string;

  accessTokenUUID?: string;
}
