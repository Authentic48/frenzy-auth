export interface IOtpService {
  deleteExpiredOTP(): Promise<void>;

  getOtpData(): Promise<{ password: string; expiredAt: Date; otp: string }>;

  createNewOTP(userUUID: string): Promise<{ otp: string }>;

  deleteOTP(userUUID: string): Promise<void>;
}
