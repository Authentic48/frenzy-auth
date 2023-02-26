export interface IOtpService {
  deleteExpiredOTP(): Promise<void>;
}
