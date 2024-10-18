import { useState } from "react";
import { getTokenBasedAction } from "./utils/actions";
import { getTokensFromStorage } from "./utils/tokens";
import { getAccountConnectionStatus } from "./utils/connectionStatus";

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
