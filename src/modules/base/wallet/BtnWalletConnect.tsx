import { clsx } from 'clsx';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import { TonConnectButton } from '@tonconnect/ui-react';
import { solana } from '@reown/appkit/networks';
import { useActiveNetwork } from 'modules/base/active-network';
import { trackClick } from 'config/segment';
import useIsMobile from 'utils/useIsMobile';
import { Button, type ButtonProps } from 'shared/v1-components/Button';
import { appKit, tokenChain } from 'config/appKit';
import { useIsLoggedIn } from '../auth/jwt-store';

const useAppKitButtonConnectHandler = (network: 'solana' | 'polygon') => {
  const appKitAccount = useAppKitAccount();
  const addr = appKitAccount.address?.toString() || '';
  const { caipNetwork, switchNetwork } = useAppKitNetwork();

  const suitableChainNamespace = network === 'solana' ? 'solana' : 'eip155';
  const isValidChain = caipNetwork?.chainNamespace === suitableChainNamespace;

  const handleConnect = async () => {
    if (appKitAccount.isConnected && !isValidChain) {
      switchNetwork(network === 'solana' ? solana : tokenChain);
    } else {
      await appKit.open({
        view: appKitAccount.isConnected ? undefined : 'Connect',
        namespace: network === 'solana' ? 'solana' : 'eip155',
      });
    }
  };

  const label = appKitAccount.isConnected
    ? isValidChain
      ? addr.substring(0, 4) + '...' + addr.substr(-4)
      : 'Switch Network'
    : 'Connect Wallet';

  return {
    handleConnect,
    label,
  };
};

export const BtnAppKitWalletConnect: React.FC<
  {
    network: 'solana' | 'polygon';
  } & ButtonProps
> = ({ network, ...buttonProps }) => {
  const appKitAccount = useAppKitAccount();
  const isMobile = useIsMobile();
  const { handleConnect, label } = useAppKitButtonConnectHandler(network);

  return (
    <Button
      size={isMobile ? 'md' : 'xs'}
      variant={appKitAccount.isConnected ? 'outline' : 'primary'}
      onClick={handleConnect}
      {...buttonProps}
    >
      {label}
    </Button>
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
          className={clsx(className, !isMobile && 'h-[38px]')}
        />
      ) : net === 'solana' || net === 'polygon' ? (
        <BtnAppKitWalletConnect className={className} network={net} />
      ) : null}
    </div>
  ) : null;
};

export default BtnWalletConnect;
