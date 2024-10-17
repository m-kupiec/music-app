export const accessTokenMock =
  "BRQLv78Ij7q-D_Hr3GUPziOY8x2wJNYqe-xRF8inj46z5GN68N_1_voS5CUQgRPXES02T6UzuF1qQL8OkjfL2lqAtUHW42O3PzXnK7DJnNCkXIdIM2ysqp7L1hp-ZEv7YnbMHvErRlHnTXVouio5mdOLg4A5HuNQVQ-g2Mk634idog0P-ZQez2mCSTrj8qzFaAyXYrlptJ8HEw";
export const refreshTokenMock =
  "AQB1BlevTACSPrCat1YGq1qV6-9AGW47D_oHJYKW5d5LM4RUt8NuvuzjQkH28g-Bn8PGhvXB7lIZDZ2O4GaUmMN8ZxwdI5yOQx0gM71MVJvTjb0V40S2CGf7kk2m3vQmR9p";

export const tokenApiSuccessJsonMock: TokenApiSuccessJson = {
  access_token: accessTokenMock,
  token_type: "Bearer",
  scope: "",
  expires_in: 3600,
  refresh_token: refreshTokenMock,
};

export const tokenApiErrorJsonMock: TokenApiErrorJson = {
  error: "invalid_request",
};

export const tokenApiSuccessResponseMock: TokenApiSuccessResponse = {
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    "Cache-Control": "no-store",
    Pragma: "no-cache",
  },
  ok: true,
  status: 200,
  statusText: "OK",
  json: (): Promise<TokenApiSuccessJson> =>
    Promise.resolve(tokenApiSuccessJsonMock),
};

export const tokesApiErrorResponseMock: TokenApiErrorResponse = {
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    "Cache-Control": "no-store",
    Pragma: "no-cache",
  },
  ok: false,
  status: 400,
  statusText: "Bad Request",
  json: (): Promise<TokenApiErrorJson> =>
    Promise.resolve(tokenApiErrorJsonMock),
};
