export const userProfileIdMock = "58rgg3stfllgez263bypwnvukpp2";

export const webApiUserProfileSuccessJsonMock: WebApiUserProfileSuccessJson = {
  display_name: "John Doe",
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

export const webApiUserProfileFailureJsonMock = { error: "Bad request" };

export const webApiUserProfileSuccessResponseMock = {
  ok: true,
  status: 200,
  json: (): Promise<WebApiUserProfileSuccessJson> =>
    Promise.resolve(webApiUserProfileSuccessJsonMock),
};

export const webApiUserProfileFailureResponseMock = {
  ok: false,
  status: 400,
  statusText: "Bad Request",
  json: (): Promise<WebApiUserProfileFailureJson> =>
    Promise.resolve(webApiUserProfileFailureJsonMock),
};
