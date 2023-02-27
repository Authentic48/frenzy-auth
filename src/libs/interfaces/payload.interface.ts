import { JwtTokenTypes } from '../utils/enum';

export interface IJWTPayload {
  type: JwtTokenTypes;
  userUUID: string;
}
