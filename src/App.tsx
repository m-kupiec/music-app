import { useAccountConnectionStatus } from "./feat/accountConnection/hooks";
import { getScreenName } from "./feat/screens/utils";
import WelcomeScreen from "./feat/screens/WelcomeScreen";

function App() {
  const accountConnectionStatus = useAccountConnectionStatus();
  const screenName = getScreenName(accountConnectionStatus);

  switch (screenName) {
    case "welcome":
      return <WelcomeScreen />;
    default:
      return <></>;
  }
}

export default App;
