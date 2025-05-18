import { useState, type PropsWithChildren } from 'react';
import { THEME, TonConnect, TonConnectUIProvider } from '@tonconnect/ui-react';

import { WagmiProvider } from 'wagmi';
import { TELEGRAM_BOT_BASE_URL } from 'config/constants';
import { wagmiConfig } from 'config/appKit';
import { LayoutActiveNetworkProvider } from '../active-network';
import WalletEvents from './WalletEvents';

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
      <WagmiProvider config={wagmiConfig}>
        <LayoutActiveNetworkProvider>
          <WalletEvents>{children}</WalletEvents>
        </LayoutActiveNetworkProvider>
      </WagmiProvider>
    </TonConnectUIProvider>
  );
};

export default WalletProvider;
