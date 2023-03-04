export interface ISessionService {
  createNewSession(
    deviceUUID: string,
    accessTokenUUID: string,
    refreshToken: string,
    userUUID: string,
  ): Promise<void>;

  createSession(
    deviceUUID: string,
    accessTokenUUID: string,
    refreshToken: string,
    userUUID: string,
  ): Promise<void>;

  deleteSession(deviceUUID: string): Promise<{ success: boolean }>;

  verifySessionAccessToken(
    deviceUUID: string,
    userUUID: string,
    accessTokenUUID: string,
  ): Promise<{ success: boolean }>;

  verifySessionRefreshToken(
    refreshToken: string,
    deviceUUID: string,
    userUUID: string,
  ): Promise<{ isRefreshTokenValid: boolean }>;

  updateSession(
    refreshToken: string,
    deviceUUID: string,
    userUUID: string,
    accessTokenUUID: string,
  ): Promise<void>;
}
