import { useMemo, type PropsWithChildren } from 'react';
import { THEME, TonConnectUIProvider } from '@tonconnect/ui-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  UnifiedWalletProvider,
} from '@jup-ag/wallet-adapter';
import { WalletConnectWalletAdapter } from '@solana/wallet-adapter-walletconnect';
import { AUTO_TRADER_MINI_APP_BASE } from 'config/constants';
import { LayoutActiveNetworkProvider } from '../active-network';
import WalletEvents from './WalletEvents';

// https://www.comparenodes.com/library/public-endpoints/solana/
const rpcEndpoint = 'https://solana-rpc.publicnode.com';

const SolanaWalletProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const network = WalletAdapterNetwork.Mainnet;
  const wallets = useMemo(
    () => [
      new WalletConnectWalletAdapter({
        network,
        options: {
          relayUrl: 'wss://relay.walletconnect.com',
          projectId: '5e4e2382e0dc5e93ebe35ff869d05c4d',
          metadata: {
            name: 'Wisdomise AutoTrader',
            description:
              'Track whales, spot moonshots, and auto-trade like a true degen — all in a few clicks. 🚀👀',
            url: 'https://app.wisdomise.com',
            icons: ['http://wisdomise.com/icon.svg'],
          },
        },
      }),
    ],
    [network],
  );

  return (
    <ConnectionProvider endpoint={rpcEndpoint}>
      <UnifiedWalletProvider
        wallets={wallets}
        config={{
          autoConnect: false,
          theme: 'dark',
          env: 'mainnet-beta',
          metadata: {
            name: 'Wisdomise AutoTrader',
            description:
              'Track whales, spot moonshots, and auto-trade like a true degen — all in a few clicks. 🚀👀',
            url: 'https://app.wisdomise.com',
            iconUrls: ['http://wisdomise.com/icon.svg'],
          },
          // notificationCallback: WalletNotification,
          // walletlistExplanation: {
          //   href: 'https://station.jup.ag/docs/additional-topics/wallet-list',
          // },
        }}
      >
        {children}
      </UnifiedWalletProvider>
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
        <WalletEvents>
          <LayoutActiveNetworkProvider>{children}</LayoutActiveNetworkProvider>
        </WalletEvents>
      </SolanaWalletProvider>
    </TonConnectUIProvider>
  );
};

export default WalletProvider;
