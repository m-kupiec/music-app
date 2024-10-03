import { useState } from "react";
import {
  getAccountConnectionStatus,
  getTokenBasedAction,
  getTokens,
} from "./utils.ts";

export function useAccountConnectionStatus(): AccountConnectionStatus {
  const [accountConnectionStatus] = useState<AccountConnectionStatus>(
    getInitialAccountConnectionStatus(),
  );

  return accountConnectionStatus;
}

function getInitialAccountConnectionStatus(): AccountConnectionStatus {
  const tokens = getTokens();
  const action = getTokenBasedAction(tokens);

  return getAccountConnectionStatus(action);
}
