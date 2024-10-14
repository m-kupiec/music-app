import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { connectSpotifyAccount } from "./feat/accountConnection/handlers";

// Handle redirection from the Spotify authorization page
if (window.location.search) {
  try {
    await connectSpotifyAccount("handleAuth");
  } catch (error) {
    alert(error);
  }
} else {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
