// eslint-disable-next-line unicorn/prefer-node-protocol
import { Buffer } from 'buffer';
import { useMemo, type PropsWithChildren } from 'react';
import { THEME, TonConnectUIProvider } from '@tonconnect/ui-react';

import {
  ConnectionProvider,
  WalletProvider as SolWalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { WalletConnectWalletAdapter } from '@solana/wallet-adapter-walletconnect';
import { AUTO_TRADER_MINI_APP_BASE } from 'config/constants';
import { LayoutActiveNetworkProvider } from '../active-network';
import WalletEvents from './WalletEvents';

// required for using @ton/core
window.Buffer = Buffer;

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
        <WalletEvents>
          <LayoutActiveNetworkProvider>{children}</LayoutActiveNetworkProvider>
        </WalletEvents>
      </SolanaWalletProvider>
    </TonConnectUIProvider>
  );
};

export default WalletProvider;
