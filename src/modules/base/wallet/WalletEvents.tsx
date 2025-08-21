import { useAccountAllQuotesBalance } from 'api/chains';
import { useActiveWallet } from 'api/chains/wallet';
import { gtag } from 'config/gtag';
import { track } from 'config/segment';
import { useActiveNetwork } from 'modules/base/active-network';
import { type PropsWithChildren, useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

const WalletEvents: React.FC<PropsWithChildren> = ({ children }) => {
  const { address, name } = useActiveWallet();
  const net = useActiveNetwork();
  const [done, setDone] = useState(false);
  const { isLoading, ...quotesBalance } = useAccountAllQuotesBalance();
  const [walletConnectedFirstTime, setWalletConnected] = useLocalStorage(
    'wallet-connected-first-time',
    false,
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(() => {
    setDone(false);
  }, [address, net]);

  useEffect(() => {
    if (address && net && quotesBalance && name && !done && !isLoading) {
      track('wallet_connected', {
        network: net,
        wallet_name: name,
        ton: quotesBalance.tonBalance,
        usdt: quotesBalance.tetherBalance,
        usdc: quotesBalance.usdCoinBalance,
        sol: quotesBalance.solBalance,
      });
      setDone(true);
    }

    if (address && !walletConnectedFirstTime) {
      gtag('event', 'wallet_connect');
      setWalletConnected(true);
    }
  }, [
    address,
    name,
    net,
    setWalletConnected,
    walletConnectedFirstTime,
    // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
    quotesBalance,
    done,
    isLoading,
  ]);

  return <>{children}</>;
};

export default WalletEvents;
