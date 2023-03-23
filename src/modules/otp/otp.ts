export interface IOtpService {
  getOtpData(): Promise<{ password: string; expiredAt: Date; otp: string }>;

  createNewOTP(userUUID: string): Promise<{ otp: string }>;

  deleteOTP(userUUID: string): Promise<void>;
}
