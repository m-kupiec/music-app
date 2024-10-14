import { useState } from "react";
import { getAccountConnectionStatus, getTokenBasedAction } from "./utils.ts";
import { getTokensFromStorage } from "./utils-tokens.ts";

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
