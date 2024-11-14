import useAccountConnectionStatus from "./feat/accountConnection/useAccountConnectionStatus";
import ConnectionView from "./feat/views/ConnectionView";
import MainView from "./feat/views/MainView";
import { getDisplayedMessage, getViewName } from "./feat/views/utils";
import WelcomeView from "./feat/views/WelcomeView";

interface Props {
  authResponse: AuthResponse;
}

function App({ authResponse }: Props) {
  const [accountConnectionStatus, setAccountConnectionStatus] =
    useAccountConnectionStatus(authResponse);
  const viewName = getViewName(accountConnectionStatus);
  const displayedMessage = getDisplayedMessage(accountConnectionStatus);

  switch (viewName) {
    case "welcome":
      return <WelcomeView displayedMessage={displayedMessage} />;
    case "connection":
      return (
        <ConnectionView
          accountConnectionStatus={accountConnectionStatus}
          setAccountConnectionStatus={setAccountConnectionStatus}
          authCode={authResponse as string}
        />
      );
    case "main":
      return <MainView displayedMessage={displayedMessage} />;
    default:
      return <></>;
  }
}

export default App;
