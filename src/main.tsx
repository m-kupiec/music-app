import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { popAuthResponseFromQuery } from "./feat/accountConnection/utils/auth";
import { getAuthBasedAction } from "./feat/accountConnection/utils/actions";
import { getAccountConnectionStatus } from "./feat/accountConnection/utils/connectionStatus";

const authResponse = popAuthResponseFromQuery();
const authAction = getAuthBasedAction(authResponse);
const accountConnectionStatus = getAccountConnectionStatus(authAction);

/*
Prevent app rendering on Spotify authorization callback page
(connection status is then still 'initiated' and not yet 'authorized' / 'unauthorized')
*/
if (accountConnectionStatus !== "initiated") {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App authResponse={authResponse!} />
    </StrictMode>,
  );
}
