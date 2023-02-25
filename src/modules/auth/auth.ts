export interface IAuthService {
  login(phone: string);

  loginVerifyOTP(phone: string, password: string);

  logout(deviceUUID: string);

  registerVerifyOTP(phone: string, password: string);

  register(phone: string);

  sendOTP(phone: string);
}
