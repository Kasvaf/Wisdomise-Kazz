import { TonConnectButton } from '@tonconnect/ui-react';
import { clsx } from 'clsx';
import { trackClick } from 'config/segment';
import { useActiveNetwork } from 'modules/base/active-network';
import { BtnAppKitWalletConnect } from 'modules/base/wallet/BtnAppkitWalletConnect';
import BtnSolanaWallets from 'modules/base/wallet/BtnSolanaWallets';
import type { ButtonSize } from 'shared/v1-components/Button';
import useIsMobile from 'utils/useIsMobile';
import { useIsLoggedIn } from '../auth/jwt-store';

const BtnWalletConnect: React.FC<{ className?: string; size?: ButtonSize }> = ({
  className,
  size,
}) => {
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
        <BtnSolanaWallets
          className="!px-2 max-md:!px-3"
          showBalance={true}
          size={size}
        />
      ) : net === 'polygon' ? (
        <BtnAppKitWalletConnect className={className} network={net} />
      ) : null}
    </div>
  ) : null;
};

export default BtnWalletConnect;
