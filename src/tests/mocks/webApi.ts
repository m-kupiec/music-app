export const userProfileIdMock = "58rgg3stfllgez263bypwnvukpp2";
export const userProfileDisplayNameMock = "John Doe";

export const accountProfileDataMock: AccountProfileData = {
  display_name: userProfileDisplayNameMock,
  id: userProfileIdMock,
  images: [],
};
export const webApiUserProfileSuccessJsonMock: WebApiUserProfileSuccessJson = {
  display_name: userProfileDisplayNameMock,
  external_urls: {
    spotify: `https://open.spotify.com/user/${userProfileIdMock}`,
  },
  href: `https://api.spotify.com/v1/users/${userProfileIdMock}`,
  id: userProfileIdMock,
  images: [],
  type: "user",
  uri: `spotify:user:${userProfileIdMock}`,
  followers: {
    href: null,
    total: 0,
  },
};

export const webApiErrorJsonMock: WebApiErrorJson = {
  error: {
    status: 401,
    message: "Bad or expired token",
  },
};

export const webApiUserProfileSuccessResponseMock: WebApiUserProfileSuccessResponse =
  {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Cache-Control": "no-store",
      Pragma: "no-cache",
    },
    ok: true,
    status: 200,
    statusText: "OK",
    json: (): Promise<WebApiUserProfileSuccessJson> =>
      Promise.resolve(webApiUserProfileSuccessJsonMock),
  };

export const webApiErrorResponseMock: WebApiErrorResponse = {
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    "Cache-Control": "no-store",
    Pragma: "no-cache",
  },
  ok: false,
  status: 401,
  statusText: "Unauthorized",
  json: (): Promise<WebApiErrorJson> => Promise.resolve(webApiErrorJsonMock),
};
