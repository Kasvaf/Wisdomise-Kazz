import { WagmiProvider } from 'wagmi';
import { Outlet } from 'react-router-dom';
import { config } from 'config/wagmi';

export default function Web3Provider() {
  return (
    <WagmiProvider config={config}>
      <Outlet />
    </WagmiProvider>
  );
}
