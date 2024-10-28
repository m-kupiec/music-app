// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2
export const authCodeMock =
  "HQDpswuAhWuF9kYjVu-4E6zFPR8pTfvVQikF1ecofX_8FYg_3_IXhSZh7nUeamLkiyVAn7JgoZEJ5TW5s6B_mgn7QLqfUPwfFTfVN2FE4wU7rd-2pFmIRYM6GTj2AyuWqehTz8_0v-RnBQ24pogpJtUVo7yR46AszY8UHmmaaukD9enT8Qe_N60vWVj4p--tqCCz-n_5gUq5kCDZNI7gDOHLOlAhh8k4EKpqtd4Ktvs2CJAteQ";
export const authSuccessQueryMock: AuthSuccessQuery = `?code=${authCodeMock}`;
export const authErrorQueryMock: AuthErrorQuery = "?error=access_denied";
export const authInvalidQueryMock = "?invalid_param=some_value";
