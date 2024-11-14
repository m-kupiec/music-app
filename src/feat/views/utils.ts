export function getDisplayedMessage(status: AccountConnectionStatus): string {
  switch (status) {
    case "none":
      return "";
    case "unauthorized":
      return "Not authorized";
    case "failed":
      return "Connection failed";
    case "closed":
    case "initiated":
    case "validated":
    case "authorized":
    case "pending":
      return "";
    case "ok":
      return "Successfully connected";
    case "updating":
    case "broken":
      return "";
    default:
      return "";
  }
}

export function getViewName(status: AccountConnectionStatus): ViewName {
  switch (status) {
    case "none":
    case "unauthorized":
    case "failed":
    case "closed":
      return "welcome";
    case "initiated":
      return "auth";
    case "validated":
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
