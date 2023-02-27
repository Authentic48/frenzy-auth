export interface IAuthService {
  verifyOTP(userUUID: string, password: number);

  register(phone: string);
}
