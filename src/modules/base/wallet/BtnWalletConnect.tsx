import { clsx } from 'clsx';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useActiveNetwork } from 'modules/base/active-network';
import { trackClick } from 'config/segment';
import useIsMobile from 'utils/useIsMobile';
import { BtnAppKitWalletConnect } from 'modules/base/wallet/BtnAppkitWalletConnect';
import BtnSolanaWallets from 'modules/base/wallet/BtnSolanaWallets';
import { useIsLoggedIn } from '../auth/jwt-store';

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
          className={clsx(className, !isMobile && 'h-[38px]')}
        />
      ) : net === 'solana' ? (
        <BtnSolanaWallets className="!px-2" />
      ) : net === 'polygon' ? (
        <BtnAppKitWalletConnect className={className} network={net} />
      ) : null}
    </div>
  ) : null;
};

export default BtnWalletConnect;
