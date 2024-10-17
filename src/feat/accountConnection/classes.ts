export class TokenApiError extends Error {
  message = "";
  details: TokenApiErrorDetails | null = null;

  constructor();
  constructor(message: string);
  constructor(details: TokenApiErrorJson);
  constructor(info?: string | TokenApiErrorJson) {
    super();

    if (!info) return;

    if (typeof info === "string") {
      this.message = info;
      return;
    }

    if (info.error) {
      this.message = info.error;

      this.details = {
        message: info.error,
        description: info.error_description ?? "",
        uri: info.error_uri ?? "",
      } as TokenApiErrorDetails;
    }
  }

  getDetails(): string {
    let details = "";

    if (!this.details) return "";

    const message = this.details.message;
    const description = this.details.description;
    const uri = this.details.uri;

    if (message) details += `${message}`;
    if (description) details += message ? `: ${description}` : `${description}`;
    if (uri) details += message || description ? ` (${uri})` : `${uri}`;

    return details;
  }
}

export class AuthError extends Error {
  message = "";
  details: AuthErrorDetails | null = null;

  constructor();
  constructor(message: string);
  constructor(message: AuthErrorDetails);
  constructor(info?: string | AuthErrorDetails) {
    super();

    if (!info) return;

    if (typeof info === "string") {
      this.message = info;
      return;
    }

    if (info.message) {
      this.message = info.message;

      this.details = {
        message: info.message,
        description: info.description ?? "",
        uri: info.uri ?? "",
      } as AuthErrorDetails;
    }
  }

  getDetails(): string {
    let details = "";

    if (!this.details) return "";

    const message = this.details.message;
    const description = this.details.description;
    const uri = this.details.uri;

    if (message) details += `${message}`;
    if (description) details += message ? `: ${description}` : `${description}`;
    if (uri) details += message || description ? ` (${uri})` : `${uri}`;

    return details;
  }
}

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
