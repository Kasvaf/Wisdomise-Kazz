import { useEffect, type PropsWithChildren } from 'react';
import { useTonAddress } from '@tonconnect/ui-react';
import { useLocalStorage } from 'usehooks-ts';
import { gtag } from 'config/gtag';

const WalletEvents: React.FC<PropsWithChildren> = ({ children }) => {
  // TODO: send both solana and ton wallet connect events to segment
  const address = useTonAddress();
  const [walletConnectedFirstTime, setWalletConnected] = useLocalStorage(
    'wallet-connected-first-time',
    false,
  );

  useEffect(() => {
    if (address && !walletConnectedFirstTime) {
      gtag('event', 'wallet_connect');
      setWalletConnected(true);
    }
  }, [address, setWalletConnected, walletConnectedFirstTime]);

  return <>{children}</>;
};

export default WalletEvents;
