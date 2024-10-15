export class Tokens implements TokenData {
  readonly accessToken;
  readonly expirationLength;
  readonly expirationTime;
  readonly refreshToken;

  constructor({
    accessToken,
    expirationLength,
    expirationTime,
    refreshToken,
  }: TokenData) {
    this.accessToken = accessToken;
    this.expirationLength = expirationLength;
    this.expirationTime = expirationTime;
    this.refreshToken = refreshToken;
  }

  getAccessToken() {
    return this.accessToken;
  }

  getExpirationLength() {
    return this.expirationLength;
  }

  getExpirationTime() {
    return this.expirationTime;
  }

  getRefreshToken() {
    return this.refreshToken;
  }
}
