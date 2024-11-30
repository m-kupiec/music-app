import CheckCircleIcon from "../../icons/CheckCircleIcon";
import { getAccountProfileData } from "../accountConnection/utils/webApi";

interface Props {
  displayedMessage?: string;
}

export default function MainView({ displayedMessage }: Props) {
  const accountProfileData = getAccountProfileData();

  return (
    <main
      className="flex h-screen flex-wrap content-center justify-center bg-spotify-black"
      data-testid="main-view"
    >
      <section className="">
        {accountProfileData ? (
          <header className="text-center">
            <h1
              className="text-lg font-bold text-spotify-white-text"
              data-testid="spotify-account-profile-data-display-name"
            >
              {accountProfileData.display_name}
            </h1>
          </header>
        ) : (
          <></>
        )}
        {displayedMessage ? (
          <div
            className="mt-5 flex items-center justify-center bg-spotify-green py-3 pl-3 pr-4 text-spotify-black-text"
            data-testid="spotify-account-connection-message-box"
          >
            <CheckCircleIcon htmlClasses={"mr-3 size-6 shrink-0"} />
            <p data-testid="spotify-account-connection-message-text">
              {displayedMessage}
            </p>
          </div>
        ) : (
          <></>
        )}
      </section>
    </main>
  );
}
