import { solana } from '@reown/appkit/networks';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import { appKit, tokenChain } from 'config/appKit';
import { Button, type ButtonProps } from 'shared/v1-components/Button';
import useIsMobile from 'utils/useIsMobile';

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
      ? `${addr.substring(0, 4)}...${addr.substr(-4)}`
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
      onClick={handleConnect}
      size={isMobile ? 'md' : 'xs'}
      variant={appKitAccount.isConnected ? 'outline' : 'primary'}
      {...buttonProps}
    >
      {label}
    </Button>
  );
};
