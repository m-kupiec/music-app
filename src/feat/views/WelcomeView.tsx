import ExclamationCircleIcon from "../../icons/ExclamationCircleIcon";
import { connectSpotifyAccount } from "../accountConnection/handlers";

interface Props {
  displayedMessage?: string;
}

function WelcomeView({ displayedMessage }: Props) {
  const handleConnectionRequest = () => {
    void connectSpotifyAccount("auth");
  };

  return (
    <main
      className="flex h-screen flex-wrap content-center justify-center bg-spotify-black"
      data-testid="welcome-view"
    >
      <header className="h-fit px-8 text-center text-spotify-white">
        <h1 className="mb-7 text-5xl font-semibold tracking-tighter">
          Music App
        </h1>
        {displayedMessage ? (
          <div
            className="mb-5 flex items-center justify-center bg-spotify-red py-3 pl-2 pr-4 text-spotify-white-text"
            data-testid="spotify-account-connection-message-box"
          >
            <ExclamationCircleIcon htmlClasses={"mr-3 size-6 shrink-0"} />
            <p data-testid="spotify-account-connection-message-text">
              {displayedMessage}
            </p>
          </div>
        ) : (
          <></>
        )}
        <p className="mx-4" data-testid="spotify-account-connection-prompt">
          Please connect your Spotify account to proceed.
        </p>
        <button
          className="mt-5 h-12 rounded-full bg-spotify-green px-8 font-semibold text-spotify-black-text transition-colors hover:bg-spotify-green-highlight"
          data-testid="spotify-account-connection-button"
          onClick={handleConnectionRequest}
        >
          Connect
        </button>
      </header>
    </main>
  );
}

export default WelcomeView;
