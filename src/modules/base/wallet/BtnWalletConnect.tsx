import { clsx } from 'clsx';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { UnifiedWalletButton } from '@jup-ag/wallet-adapter';
import { useActiveNetwork } from 'modules/base/active-network';
import '@solana/wallet-adapter-react-ui/styles.css';

const BtnSolanaWalletConnect: React.FC<{ className?: string }> = ({
  className,
}) => {
  const solanaWallet = useWallet();
  const addr = solanaWallet.publicKey?.toString() || '';
  const btnClasses = clsx(
    'flex !h-10 w-full items-center justify-center !rounded-full !text-[14px]',
    solanaWallet.connected ? '!bg-[#121214] !pl-4' : '!bg-[#00a3ff]',
    className,
  );

  return (
    <UnifiedWalletButton
      buttonClassName={btnClasses}
      currentUserClassName={btnClasses}
      overrideContent={
        solanaWallet.connected
          ? addr.substring(0, 4) + '...' + addr.substr(-4)
          : 'Connect Wallet'
      }
    />
  );
};

const BtnWalletConnect: React.FC<{ className?: string }> = ({ className }) => {
  const net = useActiveNetwork();

  return net === 'the-open-network' ? (
    <TonConnectButton className={className} />
  ) : net === 'solana' ? (
    <BtnSolanaWalletConnect className={className} />
  ) : null;
};

export default BtnWalletConnect;
