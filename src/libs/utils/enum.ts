export enum AuthRouteTopics {
  REGISTER = 'auth.register.command',
  REGISTER_VERIFY_OTP = 'auth.verify-otp.command',

  RE_SEND_OTP = 'auth.re-send-otp.command',

  LOGIN = 'auth.login.command',

  LOGOUT = 'auth.logout.command',

  VERIFY_SESSION = 'auth.verify-session.query',

  REFRESH = 'auth.refresh.command',

  GET_USER_INFO = 'auth.get-user-info.query',
}

export enum JwtTokenTypes {
  ACCESS_TOKEN = 0,
  REFRESH_TOKEN = 1,

  VERIFY_OTP_ACCESS_TOKEN = 2,
}
