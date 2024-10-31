import { useAccountConnectionStatus } from "./feat/accountConnection/hooks";
import { getScreenName } from "./feat/screens/utils";
import ConnectionProgress from "./feat/screens/ConnectionProgress";
import WelcomeScreen from "./feat/screens/WelcomeScreen";

interface Props {
  authResponse: AuthResponse;
}

function App({ authResponse }: Props) {
  const [accountConnectionStatus, setAccountConnectionStatus] =
    useAccountConnectionStatus(authResponse);
  const screenName = getScreenName(accountConnectionStatus);

  switch (screenName) {
    case "welcome":
      return <WelcomeScreen />;
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
