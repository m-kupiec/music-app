export class Tokens implements TokensData {
  readonly accessToken;
  readonly expirationLength;
  readonly expirationTime;
  readonly refreshToken;

  constructor({
    accessToken,
    expirationLength,
    expirationTime,
    refreshToken,
  }: TokensData) {
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
