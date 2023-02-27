export enum AuthRouteTopics {
  REGISTER = 'auth.register.command',
  REGISTER_VERIFY_OTP = 'auth.verify-otp.command',
}

export enum JwtTokenTypes {
  ACCESS_TOKEN = 0,
  REFRESH_TOKEN = 1,

  VERIFY_OTP_ACCESS_TOKEN = 2,
}
