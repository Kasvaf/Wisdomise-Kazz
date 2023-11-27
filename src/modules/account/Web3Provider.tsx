import { WagmiConfig } from 'wagmi';
import { Outlet } from 'react-router-dom';
import { config, configWeb3Modal } from 'config/wagmi';

configWeb3Modal();

export default function Web3Provider() {
  return (
    <WagmiConfig config={config}>
      <Outlet />
    </WagmiConfig>
  );
}
