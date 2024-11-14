import useAccountConnectionProcess from "../accountConnection/useAccountConnectionProcess";

interface Props {
  accountConnectionStatus: AccountConnectionStatus;
  setAccountConnectionStatus: React.Dispatch<
    React.SetStateAction<AccountConnectionStatus>
  >;
  authCode: string;
}

export default function ConnectionView({
  accountConnectionStatus,
  setAccountConnectionStatus,
  authCode,
}: Props) {
  useAccountConnectionProcess(
    accountConnectionStatus,
    setAccountConnectionStatus,
    authCode,
  );

  return (
    <main
      className="h-screen bg-spotify-black"
      data-testid="connection-view"
    ></main>
  );
}
