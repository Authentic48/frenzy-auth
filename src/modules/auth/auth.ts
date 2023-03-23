export interface IAuthService {
  verifyOTP(
    userUUID: string,
    password: number,
  ): Promise<{ accessToken: string; refreshToken: string }>;

  register(phone: string): Promise<{ verifyOTPToken: string }>;

  reSendOTP(userUUID: string): Promise<{ success: boolean }>;

  login(phone: string): Promise<{ verifyOTPToken: string }>;

  logout(deviceUUID: string): Promise<{ success: boolean }>;

  refresh(
    deviceUUID: string,
    userUUID: string,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }>;
}
