import { useEffect, useRef } from "react";
import { connectSpotifyAccount } from "../accountConnection/handlers";
import { getAccountConnectionStatus } from "../accountConnection/utils/connectionStatus";
import {
  getTokenApiBasedAction,
  getWebApiBasedAction,
} from "../accountConnection/utils/actions";

export function useSpotifyAccountConnectionProcess(
  accountConnectionStatus: AccountConnectionStatus,
  setAccountConnectionStatus: React.Dispatch<
    React.SetStateAction<AccountConnectionStatus>
  >,
  authCode: string,
) {
  const hasContinuedConnecting = useRef(false);

  useEffect(() => {
    if (hasContinuedConnecting.current) return;

    if (!["authorized", "validated"].includes(accountConnectionStatus)) return;

    const continueConnectingSpotifyAccount = async () => {
      let action: ServerAction;

      if (accountConnectionStatus === "authorized") {
        action = await getTokenApiBasedAction(connectSpotifyAccount, authCode);
      }

      action = await getWebApiBasedAction(connectSpotifyAccount);

      if (action === "initDataProvide") return await Promise.resolve(action);

      return await Promise.reject(new Error(action));
    };

    let updatedStatus: AccountConnectionStatus;

    continueConnectingSpotifyAccount()
      .then((action) => {
        updatedStatus = getAccountConnectionStatus(action);
      })
      .catch(({ message: action }) => {
        updatedStatus = getAccountConnectionStatus(action as ServerAction);
      })
      .finally(() => setAccountConnectionStatus(updatedStatus));

    hasContinuedConnecting.current = true;
  }, [accountConnectionStatus, setAccountConnectionStatus, authCode]);
}
