import { cookieStorage, createStorage } from 'wagmi';
import { polygon, sepolia } from 'wagmi/chains';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { createAppKit } from '@reown/appkit';
import { isProduction } from 'utils/version';

// Get projectId from https://cloud.reown.com
const projectId = 'a7095c97109f109bdc9c51312bb384cc';

export const defaultChain = isProduction ? polygon : sepolia;

export const adapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  projectId,
  networks: [defaultChain],
});

const metadata = {
  name: 'Wisdomise',
  description: 'Discover, Validate & Trade',
  url: 'https://wisdomise.com',
  icons: [],
};

export const appKitModal = createAppKit({
  adapters: [adapter],
  projectId,
  networks: [defaultChain],
  defaultNetwork: defaultChain,
  metadata,
  themeVariables: {
    '--w3m-z-index': 10_000,
  },
  features: {
    socials: false,
    email: false,
  },
});

export const config = adapter.wagmiConfig;
