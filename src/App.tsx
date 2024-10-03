import { useAccountConnectionStatus } from "./feat/accountConnection/hooks.ts";
import { getScreenName } from "./feat/screens/utils.ts";
import WelcomeScreen from "./feat/screens/WelcomeScreen.tsx";

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
