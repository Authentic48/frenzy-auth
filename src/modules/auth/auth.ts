export interface IAuthService {
  verifyOTP(phone: string, password: string);

  register(phone: string);
}
