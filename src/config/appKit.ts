import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TrustWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { createAppKit } from '@reown/appkit/react';
import { solana } from '@reown/appkit/networks';
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { cookieStorage, createStorage, http } from 'wagmi';
import { polygon, sepolia } from 'wagmi/chains';
import { isProduction } from 'utils/version';

// 1. Get projectId from https://cloud.reown.com
const projectId = '5e4e2382e0dc5e93ebe35ff869d05c4d';
const metadata = {
  name: 'Wisdomise AutoTrader',
  description:
    'Track whales, spot moonshots, and auto-trade like a true degen — all in a few clicks. 🚀👀',
  url: 'https://app.wisdomise.com',
  icons: ['http://wisdomise.com/icon.svg'],
};

const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: [
    new TrustWalletAdapter(),
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ],
});

export const polygonChain = isProduction ? polygon : sepolia;
const wagmiPolygonAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  projectId,
  networks: [polygonChain],
  transports: {
    [polygon.id]: http(polygon.rpcUrls.default.http[0]),
    [sepolia.id]: http(sepolia.rpcUrls.default.http[0]),
  },
  customRpcUrls: {
    [`eip155:${polygon.id}`]: [{ url: polygon.rpcUrls.default.http[0] }],
    [`eip155:${sepolia.id}`]: [
      {
        url: sepolia.rpcUrls.default.http[0],
      },
    ],
  },
});
export const wagmiConfig = wagmiPolygonAdapter.wagmiConfig;

// 3. Create modal
export const appKit = createAppKit({
  projectId,
  metadata,
  adapters: [solanaWeb3JsAdapter, wagmiPolygonAdapter],
  networks: [solana, polygonChain],
  defaultNetwork: solana,
  themeVariables: {
    '--w3m-z-index': 1001,
    '--w3m-border-radius-master': '2px',
  },

  features: {
    send: false,
    pay: false,
    receive: false,
    history: false,
    onramp: false,
    swaps: false,
    socials: false,
    email: false,
    analytics: false,
  },
});
