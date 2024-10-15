import { Tokens } from "../../feat/accountConnection/classes";

const validExpirationLength = 3600;
const invalidExpirationLength = Infinity;
const nonEmptyToken = "******";
const emptyToken = "";
const nonExpiredTime = Date.now() + validExpirationLength * 1000;
const expiredTime = Date.now() - validExpirationLength * 1000;
const invalidTime = Infinity;

export const mockTokenData: TokenData = {
  accessToken: nonEmptyToken,
  expirationLength: validExpirationLength,
  expirationTime: nonExpiredTime,
  refreshToken: nonEmptyToken,
};

export const nonExpiredTokens = new Tokens({
  accessToken: nonEmptyToken,
  expirationLength: validExpirationLength,
  expirationTime: nonExpiredTime,
  refreshToken: nonEmptyToken,
});

export const expiredTokens = new Tokens({
  accessToken: nonEmptyToken,
  expirationLength: validExpirationLength,
  expirationTime: expiredTime,
  refreshToken: nonEmptyToken,
});

export const invalidTokens = { invalidProperty: nonEmptyToken };

export const tokensWithEmptyAccessToken = new Tokens({
  accessToken: emptyToken,
  expirationLength: validExpirationLength,
  expirationTime: nonExpiredTime,
  refreshToken: nonEmptyToken,
});

export const tokensWithEmptyRefreshToken = new Tokens({
  accessToken: nonEmptyToken,
  expirationLength: validExpirationLength,
  expirationTime: nonExpiredTime,
  refreshToken: emptyToken,
});

export const tokensWithInvalidLength = new Tokens({
  accessToken: nonEmptyToken,
  expirationLength: invalidExpirationLength,
  expirationTime: nonExpiredTime,
  refreshToken: nonEmptyToken,
});

export const tokensWithInvalidTime = new Tokens({
  accessToken: nonEmptyToken,
  expirationLength: validExpirationLength,
  expirationTime: invalidTime,
  refreshToken: nonEmptyToken,
});
