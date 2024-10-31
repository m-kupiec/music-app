import { useSpotifyAccountConnectionProcess } from "./hooks";

interface Props {
  accountConnectionStatus: AccountConnectionStatus;
  setAccountConnectionStatus: React.Dispatch<
    React.SetStateAction<AccountConnectionStatus>
  >;
  authCode: string;
}

export default function ConnectionProgress({
  accountConnectionStatus,
  setAccountConnectionStatus,
  authCode,
}: Props) {
  useSpotifyAccountConnectionProcess(
    accountConnectionStatus,
    setAccountConnectionStatus,
    authCode,
  );

  return <></>;
}
