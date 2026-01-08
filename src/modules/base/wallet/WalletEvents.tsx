import { gtag } from 'config/gtag';
import { track } from 'config/segment';
import { useActiveNetwork } from 'modules/base/active-network';
import { type PropsWithChildren, useEffect, useState } from 'react';
import { useAllQuotesBalance } from 'services/chains';
import { useWallets } from 'services/chains/wallet';
import { useLocalStorage } from 'usehooks-ts';

const WalletEvents: React.FC<PropsWithChildren> = ({ children }) => {
  const { singleWallet } = useWallets();
  const net = useActiveNetwork();
  const [done, setDone] = useState(false);
  const { isLoading, ...quotesBalance } = useAllQuotesBalance();
  const [walletConnectedFirstTime, setWalletConnected] = useLocalStorage(
    'wallet-connected-first-time',
    false,
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(() => {
    setDone(false);
  }, [singleWallet?.address, net]);

  useEffect(() => {
    if (
      singleWallet?.address &&
      net &&
      quotesBalance &&
      singleWallet?.name &&
      !done &&
      !isLoading
    ) {
      track('wallet_connected', {
        network: net,
        wallet_name: singleWallet.name,
        ton: quotesBalance.tonBalance,
        usdt: quotesBalance.tetherBalance,
        usdc: quotesBalance.usdCoinBalance,
        sol: quotesBalance.solBalance,
      });
      setDone(true);
    }

    if (singleWallet?.address && !walletConnectedFirstTime) {
      gtag('event', 'wallet_connect');
      setWalletConnected(true);
    }
  }, [
    singleWallet?.address,
    singleWallet?.name,
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
