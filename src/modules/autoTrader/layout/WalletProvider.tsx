// eslint-disable-next-line unicorn/prefer-node-protocol
import { Buffer } from 'buffer';
import { useEffect, useMemo, type PropsWithChildren } from 'react';
import {
  THEME,
  TonConnectUIProvider,
  useTonAddress,
} from '@tonconnect/ui-react';
import { useLocalStorage } from 'usehooks-ts';

import {
  ConnectionProvider,
  WalletProvider as SolWalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { WalletConnectWalletAdapter } from '@solana/wallet-adapter-walletconnect';
import { gtag } from 'config/gtag';
import { AUTO_TRADER_MINI_APP_BASE } from 'config/constants';
import { isProduction } from 'utils/version';

// required for using @ton/core
window.Buffer = Buffer;

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

const SolanaWalletProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const network = isProduction
    ? WalletAdapterNetwork.Mainnet
    : WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [
      new WalletConnectWalletAdapter({
        network,
        options: {
          relayUrl: 'wss://relay.walletconnect.com',
          projectId: 'e899c82be21d4acca2c8aec45e893598',
          metadata: {
            name: 'Wisdomise AutoTrader',
            description:
              'Track whales, spot moonshots, and auto-trade like a true degen — all in a few clicks. 🚀👀',
            url: 'https://wisdomise.com',
            icons: ['http://wisdomise.com/icon.svg'],
          },
        },
      }),
    ],
    [network],
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolWalletProvider>
    </ConnectionProvider>
  );
};

const WalletProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <TonConnectUIProvider
      manifestUrl="https://wisdomise.com/tonconnect-manifest.json"
      uiPreferences={{ theme: THEME.DARK }}
      actionsConfiguration={{
        twaReturnUrl: AUTO_TRADER_MINI_APP_BASE,
      }}
    >
      <SolanaWalletProvider>
        <WalletEvents>{children}</WalletEvents>
      </SolanaWalletProvider>
    </TonConnectUIProvider>
  );
};

export default WalletProvider;
