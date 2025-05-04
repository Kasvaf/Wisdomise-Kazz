import { clsx } from 'clsx';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useActiveNetwork } from 'modules/base/active-network';
import '@solana/wallet-adapter-react-ui/styles.css';
import useIsMobile from 'utils/useIsMobile';
import { trackClick } from 'config/segment';
import { useIsLoggedIn } from '../auth/jwt-store';
// eslint-disable-next-line import/no-unassigned-import
import '@reown/appkit/library/react';

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
  const isLoggedIn = useIsLoggedIn();

  const onClick = () => {
    trackClick('wallet_connect', { network: net })();
  };

  if (!isLoggedIn) return null;

  return net ? (
    <div onClick={onClick}>
      {net === 'the-open-network' ? (
        <TonConnectButton
          className={clsx(className, !isMobile && 'h-[32px]')}
        />
      ) : net === 'solana' ? (
        <BtnSolanaWalletConnect className={className} />
      ) : net === 'polygon' ? (
        <appkit-button size="sm" balance="hide" />
      ) : null}
    </div>
  ) : null;
};

export default BtnWalletConnect;
