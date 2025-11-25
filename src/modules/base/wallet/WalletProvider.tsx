import { THEME, TonConnect, TonConnectUIProvider } from '@tonconnect/ui-react';
import { wagmiConfig } from 'config/appKit';
import { TELEGRAM_BOT_BASE_URL } from 'config/constants';
import { type PropsWithChildren, useState } from 'react';
import { SolanaConnectionProvider } from 'services/chains/connection';
import { WagmiProvider } from 'wagmi';
import { LayoutActiveNetworkProvider } from '../active-network';
import WalletEvents from './WalletEvents';

const WalletProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [tonConnector] = useState(
    new TonConnect({
      manifestUrl: 'https://goatx.trade/tonconnect-manifest.json',
      walletsListSource: '/ton-wallets.json',
    }),
  );

  return (
    <TonConnectUIProvider
      actionsConfiguration={{
        twaReturnUrl: TELEGRAM_BOT_BASE_URL,
      }}
      connector={tonConnector}
      uiPreferences={{ theme: THEME.DARK, borderRadius: 's' }}
    >
      <WagmiProvider config={wagmiConfig}>
        <SolanaConnectionProvider>
          <LayoutActiveNetworkProvider>
            <WalletEvents>{children}</WalletEvents>
          </LayoutActiveNetworkProvider>
        </SolanaConnectionProvider>
      </WagmiProvider>
    </TonConnectUIProvider>
  );
};

export default WalletProvider;
