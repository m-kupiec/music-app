import CheckCircleIcon from "../../icons/CheckCircleIcon";

interface Props {
  displayedMessage?: string;
}

export default function MainScreen({ displayedMessage }: Props) {
  return (
    <main
      className="flex h-screen flex-wrap content-center justify-center bg-spotify-black"
      data-testid="main-screen"
    >
      {displayedMessage ? (
        <div
          className="mb-5 flex items-center justify-center bg-spotify-green py-3 pl-3 pr-4 text-spotify-black-text"
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
    </main>
  );
}
