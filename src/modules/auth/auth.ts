export interface IAuthService {
  verifyOTP(
    userUUID: string,
    password: number,
  ): Promise<{ accessToken: string; refreshToken: string }>;

  register(phone: string): Promise<{ accessToken: string }>;

  reSendOTP(userUUID: string): Promise<{ success: boolean }>;

  login(phone: string): Promise<{ accessToken: string }>;

  logout(deviceUUID: string): Promise<{ success: boolean }>;
}
