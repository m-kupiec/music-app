import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { popAuthResponseFromQuery } from "./feat/accountConnection/utils/auth";

const authResponse = popAuthResponseFromQuery();

if (authResponse !== undefined) {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App authResponse={authResponse} />
    </StrictMode>,
  );
}
