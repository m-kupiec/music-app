import { useState } from "react";
import { getAccountConnectionStatus, getTokenBasedAction } from "./utils";
import { getTokensFromStorage } from "./utils-tokens";

export function useAccountConnectionStatus(): AccountConnectionStatus {
  const [accountConnectionStatus] = useState<AccountConnectionStatus>(
    getInitialAccountConnectionStatus(),
  );

  return accountConnectionStatus;
}

function getInitialAccountConnectionStatus(): AccountConnectionStatus {
  const tokens = getTokensFromStorage();
  const action = getTokenBasedAction(tokens);

  return getAccountConnectionStatus(action);
}
