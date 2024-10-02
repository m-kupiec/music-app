export function getScreenName(status: AccountConnectionStatus): ScreenName {
  switch (status) {
    case "none":
    case "unauthorized":
    case "failed":
    case "closed":
      return "welcome";
    case "initiated":
      return "auth";
    case "authorized":
    case "pending":
      return "connection";
    case "ok":
    case "updating":
    case "broken":
      return "main";
    default:
      return "none";
  }
}
