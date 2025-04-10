import { clsx } from 'clsx';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useActiveNetwork } from 'modules/base/active-network';
import '@solana/wallet-adapter-react-ui/styles.css';
import useIsMobile from 'utils/useIsMobile';

const BtnSolanaWalletConnect: React.FC<{ className?: string }> = ({
  className,
}) => {
  const isMobile = useIsMobile();
  const solanaWallet = useWallet();
  const addr = solanaWallet.publicKey?.toString() || '';
  return (
    <WalletMultiButton
      style={{
        borderRadius: 20,
        height: isMobile ? 40 : 32,
        fontSize: 14,
        lineHeight: 'normal',
        ...(solanaWallet.connected
          ? { background: '#121214', paddingLeft: 16 }
          : { background: '#00a3ff' }),
      }}
      className={className}
    >
      {solanaWallet.connected
        ? addr.substring(0, 4) + '...' + addr.substr(-4)
        : 'Connect Wallet'}
    </WalletMultiButton>
  );
};

const BtnWalletConnect: React.FC<{ className?: string }> = ({ className }) => {
  const isMobile = useIsMobile();
  const net = useActiveNetwork();

  return net === 'the-open-network' ? (
    <TonConnectButton className={clsx(className, !isMobile && 'h-[32px]')} />
  ) : net === 'solana' ? (
    <BtnSolanaWalletConnect className={className} />
  ) : null;
};

export default BtnWalletConnect;
