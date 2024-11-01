import useAccountConnectionStatus from "./feat/accountConnection/useAccountConnectionStatus";
import ConnectionProgress from "./feat/screens/ConnectionProgress";
import MainScreen from "./feat/screens/MainScreen";
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
    case "main":
      return <MainScreen displayedMessage={displayedMessage} />;
    default:
      return <></>;
  }
}

export default App;
