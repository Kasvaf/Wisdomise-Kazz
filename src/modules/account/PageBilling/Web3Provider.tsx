import { WagmiConfig } from 'wagmi';
import { type ReactNode } from 'react';
import { config, configWeb3Modal } from 'config/wagmi';

interface Props {
  children: ReactNode;
}

configWeb3Modal();

export default function Web3Provider({ children }: Props) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}
