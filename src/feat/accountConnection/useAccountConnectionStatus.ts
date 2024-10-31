import { useState } from "react";
import { getAuthBasedAction, getTokenBasedAction } from "./utils/actions";
import { getTokensFromStorage } from "./utils/tokens";
import { getAccountConnectionStatus } from "./utils/connectionStatus";

export default function useAccountConnectionStatus(
  authResponse: AuthResponse,
): [
  AccountConnectionStatus,
  React.Dispatch<React.SetStateAction<AccountConnectionStatus>>,
] {
  const [accountConnectionStatus, setAccountConnectionStatus] =
    useState<AccountConnectionStatus>(
      getInitialAccountConnectionStatus(authResponse),
    );

  return [accountConnectionStatus, setAccountConnectionStatus];
}

function getInitialAccountConnectionStatus(
  authResponse: AuthResponse,
): AccountConnectionStatus {
  let action: ServerAction | BrowserAction = "none";

  action = getAuthBasedAction(authResponse);

  if (action === "none") {
    const tokens = getTokensFromStorage();
    action = getTokenBasedAction(tokens);
  }

  const accountConnectionStatus = getAccountConnectionStatus(action);

  return accountConnectionStatus;
}
