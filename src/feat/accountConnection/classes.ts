export class WebApiError extends Error {
  status = NaN;
  message = "";
  details: WebApiErrorDetails | null = null;

  constructor();
  constructor(statusOrMessage: string);
  constructor(details: WebApiErrorJson);
  constructor(info?: string | WebApiErrorJson) {
    super();

    if (!info) return;

    if (typeof info === "string") {
      if (Number(info)) {
        this.status = Number(info);
      } else {
        this.message = info;
      }
      return;
    }

    if ("error" in info) {
      if (info.error.status) this.status = info.error.status;
      if (info.error.message) this.message = info.error.message;

      this.details = {
        status: this.status,
        message: this.message,
      } as WebApiErrorDetails;
    }
  }

  getDetails(): string {
    let details = "";

    if (!this.details) return "";

    const status = this.details.status;
    const message = this.details.message;

    if (status) details += `${status}`;
    if (message) details += status ? `: ${message}` : `${message}`;

    return details;
  }
}

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
  constructor(details: AuthErrorParams);
  constructor(info?: string | AuthErrorParams) {
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
