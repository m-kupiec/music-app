export function getAccountConnectionStatus(
  action: Action,
): AccountConnectionStatus {
  switch (action) {
    case "none":
    case "tokensNotFound":
      return "none";
    case "initTokenValidated":
      return "validated";
    case "initTokenExpired":
    case "initTokensProvide":
    case "moreTokensProvide":
      return "pending";
    case "accountConnect":
    case "authPageDisplay":
      return "initiated";
    case "authCodeProvide":
      return "authorized";
    case "authCodeDeny":
      return "unauthorized";
    case "initTokensDeny":
    case "initDataDeny":
      return "failed";
    case "initDataProvide":
    case "requestAccept":
      return "ok";
    case "refrTokenExpired":
    case "refrTokenValidated":
      return "updating";
    case "moreTokensDeny":
    case "requestDeny":
      return "broken";
    case "accountDisconnect":
      return "closed";
    default:
      return "none";
  }
}
