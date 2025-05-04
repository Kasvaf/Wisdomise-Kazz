import { useMemo, useState, type PropsWithChildren } from 'react';
import { THEME, TonConnect, TonConnectUIProvider } from '@tonconnect/ui-react';
import {
  ConnectionProvider,
  WalletProvider as SolWalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { WalletConnectWalletAdapter } from '@solana/wallet-adapter-walletconnect';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { WagmiProvider } from 'wagmi';
import { TELEGRAM_BOT_BASE_URL } from 'config/constants';
import { config } from 'config/wagmi';
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
      ...(navigator.userAgent.includes('iPhone') &&
      !/phantom|solflare|webview|wv/i.test(navigator.userAgent)
        ? [new SolflareWalletAdapter(), new PhantomWalletAdapter()]
        : []),
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
  const [tonConnector] = useState(
    new TonConnect({
      manifestUrl: 'https://wisdomise.com/tonconnect-manifest.json',
      walletsListSource: '/ton-wallets.json',
    }),
  );

  return (
    <TonConnectUIProvider
      connector={tonConnector}
      uiPreferences={{ theme: THEME.DARK }}
      actionsConfiguration={{
        twaReturnUrl: TELEGRAM_BOT_BASE_URL,
      }}
    >
      <SolanaWalletProvider>
        <WagmiProvider config={config}>
          <LayoutActiveNetworkProvider>
            <WalletEvents>{children}</WalletEvents>
          </LayoutActiveNetworkProvider>
        </WagmiProvider>
      </SolanaWalletProvider>
    </TonConnectUIProvider>
  );
};

export default WalletProvider;
