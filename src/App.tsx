import { useAccountConnectionStatus } from "./feat/accountConnection/hooks";
import ConnectionProgress from "./feat/screens/ConnectionProgress";
import { getDisplayedMessage, getScreenName } from "./feat/screens/utils";
import WelcomeScreen from "./feat/screens/WelcomeScreen";

interface Props {
  authResponse: AuthResponse;
}

function App({ authResponse }: Props) {
  const [accountConnectionStatus, setAccountConnectionStatus] =
    useAccountConnectionStatus(authResponse);
  const screenName = getScreenName(accountConnectionStatus);
  const displayedMessage = getDisplayedMessage(accountConnectionStatus);

  switch (screenName) {
    case "welcome":
      return <WelcomeScreen displayedMessage={displayedMessage} />;
    case "connection":
      return (
        <ConnectionProgress
          accountConnectionStatus={accountConnectionStatus}
          setAccountConnectionStatus={setAccountConnectionStatus}
          authCode={authResponse as string}
        />
      );
    default:
      return <></>;
  }
}

export default App;
