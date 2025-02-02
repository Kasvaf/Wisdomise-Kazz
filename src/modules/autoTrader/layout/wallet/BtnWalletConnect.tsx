import { TonConnectButton } from '@tonconnect/ui-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import useActiveNetwork from 'modules/autoTrader/layout/useActiveNetwork';
import '@solana/wallet-adapter-react-ui/styles.css';

const BtnSolanaWalletConnect = () => {
  const solanaWallet = useWallet();
  const addr = solanaWallet.publicKey?.toString() || '';
  return (
    <WalletMultiButton
      style={{
        borderRadius: 20,
        height: 40,
        fontSize: 14,
        ...(solanaWallet.connected
          ? { background: '#121214', paddingLeft: 16 }
          : { background: '#00a3ff' }),
      }}
    >
      {solanaWallet.connected
        ? addr.substring(0, 4) + '...' + addr.substr(-4)
        : 'Connect Wallet'}
    </WalletMultiButton>
  );
};

const BtnWalletConnect: React.FC = () => {
  const net = useActiveNetwork();
  return net === 'the-open-network' ? (
    <TonConnectButton />
  ) : net === 'solana' ? (
    <BtnSolanaWalletConnect />
  ) : (
    <div />
  );
};

export default BtnWalletConnect;
