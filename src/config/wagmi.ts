import { createConfig, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { polygon, sepolia } from 'wagmi/chains';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { walletConnectProvider } from '@web3modal/wagmi';
import { isProduction } from 'utils/version';

export const defaultChain = isProduction ? polygon : sepolia;
const CONNECT_WALLET_PROJECT_ID = '50b522e31c509ae4c2fe421459868c61';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [defaultChain],
  [
    walletConnectProvider({ projectId: CONNECT_WALLET_PROJECT_ID }),
    publicProvider(),
  ],
);

export const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [
    new InjectedConnector({ chains, options: { shimDisconnect: true } }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: CONNECT_WALLET_PROJECT_ID,
        showQrModal: false,
      },
    }),
  ],
});

export function configWeb3Modal() {
  createWeb3Modal({
    wagmiConfig: config,
    projectId: CONNECT_WALLET_PROJECT_ID,
    chains,
    themeVariables: {
      '--w3m-z-index': 1001,
    },
  });
}
