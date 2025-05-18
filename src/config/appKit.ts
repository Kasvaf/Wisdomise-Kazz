import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TrustWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import {
  createDefaultAddressSelector,
  createDefaultAuthorizationResultCache,
  createDefaultWalletNotFoundHandler,
  SolanaMobileWalletAdapter,
} from '@solana-mobile/wallet-adapter-mobile';
import { createAppKit } from '@reown/appkit/react';
import { polygon, sepolia, solana } from '@reown/appkit/networks';
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { cookieStorage, createStorage, http } from 'wagmi';
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
    new SolanaMobileWalletAdapter({
      addressSelector: createDefaultAddressSelector(),
      appIdentity: {
        name: metadata.name,
        icon: metadata.icons[0],
        uri: metadata.url,
      },
      authorizationResultCache: createDefaultAuthorizationResultCache(),
      chain: solana.caipNetworkId,
      onWalletNotFound: createDefaultWalletNotFoundHandler(),
    }),
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

  experimental_preferUniversalLinks: true,
  enableWalletConnect: true,
  featuredWalletIds: [
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // trust-wallet
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // meta-mask
    'a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393', // phantom
    '59968c4e5ef18efe3a287cb1206c41fd46d69589def8fd5c4990be92401fabcb', // oisy
    '1ca0bdd4747578705b1939af023d120677c64fe6ca76add81fda36e350605e79', // solflare
  ],

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
    legalCheckbox: false,
  },
});

// remove bottom footer with copyright
class EmptyElement extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = `
    :host {
      padding-top: 0 !important;
    }`;
    shadow.append(style);
  }
}
customElements.define('wui-ux-by-reown', EmptyElement);
