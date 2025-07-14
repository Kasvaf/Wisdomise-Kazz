import { createAppKit } from '@reown/appkit/react';
import { polygon, sepolia, solana } from '@reown/appkit/networks';
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { cookieStorage, createStorage, http } from 'wagmi';
import { isProduction } from 'utils/version';

// 1. Get projectId from https://cloud.reown.com
export const projectId = '5e4e2382e0dc5e93ebe35ff869d05c4d';
const metadata = {
  name: 'Wisdomise AutoTrader',
  description:
    'Track whales, spot moonshots, and auto-trade like a true degen — all in a few clicks. 🚀👀',
  url: 'https://app.wisdomise.com',
  icons: ['http://wisdomise.com/icon.svg'],
};

const solanaWeb3JsAdapter = new SolanaAdapter();

export const tokenChain = isProduction ? polygon : sepolia;
const wagmiPolygonAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  projectId,
  networks: [tokenChain],
  transports: {
    [tokenChain.id]: http(tokenChain.rpcUrls.default.http[0]),
  },
  customRpcUrls: {
    [`eip155:${tokenChain.id}`]: [{ url: tokenChain.rpcUrls.default.http[0] }],
  },
});
export const wagmiConfig = wagmiPolygonAdapter.wagmiConfig;

// 3. Create modal
export const appKit = createAppKit({
  projectId,
  metadata,
  adapters: [solanaWeb3JsAdapter, wagmiPolygonAdapter],
  networks: [solana, tokenChain],
  defaultNetwork: solana,
  themeVariables: {
    '--w3m-z-index': 1001,
    '--w3m-border-radius-master': '2px',
  },

  experimental_preferUniversalLinks: false,
  enableWalletConnect: true,
  enableWalletGuide: true,

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
