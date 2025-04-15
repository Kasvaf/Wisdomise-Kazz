import { useEffect, type PropsWithChildren, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { gtag } from 'config/gtag';
import { useAccountAllQuotesBalance, useActiveWallet } from 'api/chains';
import { track } from 'config/segment';
import { useActiveNetwork } from 'modules/base/active-network';

const WalletEvents: React.FC<PropsWithChildren> = ({ children }) => {
  const { address, name } = useActiveWallet();
  const net = useActiveNetwork();
  const [done, setDone] = useState(false);
  const quotesBalance = useAccountAllQuotesBalance();
  const [walletConnectedFirstTime, setWalletConnected] = useLocalStorage(
    'wallet-connected-first-time',
    false,
  );

  useEffect(() => {
    setDone(false);
  }, [address, net]);

  useEffect(() => {
    if (
      address &&
      net &&
      quotesBalance.tonBalance !== undefined &&
      quotesBalance.tetherBalance !== undefined &&
      quotesBalance.usdCoinBalance !== undefined &&
      quotesBalance.solBalance !== undefined &&
      name &&
      !done
    ) {
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
    quotesBalance,
    done,
  ]);

  return <>{children}</>;
};

export default WalletEvents;
