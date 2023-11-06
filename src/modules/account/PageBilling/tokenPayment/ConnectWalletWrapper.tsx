import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { type ReactNode, useCallback, useEffect, useState } from 'react';
import { goerli, polygon } from 'wagmi/chains';
import { notification } from 'antd';
import Card from 'shared/Card';
import Button from 'shared/Button';
import { useAccountQuery } from 'api';
import { useGenerateNonceQuery, useNonceVerificationMutation } from 'api/defi';
import useSignInWithEthereum from 'modules/account/PageBilling/tokenPayment/useSiwe';
import { shortenAddress } from 'utils/shortenAddress';
import { isProduction } from 'utils/version';
import { unwrapErrorMessage } from 'utils/error';
import { ReactComponent as Wallet } from '../images/wallet.svg';
import { ReactComponent as Key } from '../images/key.svg';

interface Props {
  children: ReactNode;
  className?: string;
}

export default function ConnectWalletWrapper({ children, className }: Props) {
  const { connector: activeConnector, isConnected, address } = useAccount();
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const { data: account } = useAccountQuery();
  const [showNonce, setShowNonce] = useState(false);
  const [showWrapperContent, setShowWrapperContent] = useState(false);
  const [showConnectWallet, setShowConnectWallet] = useState(true);
  const [showError, setShowError] = useState(true);
  const { data: nonceResponse } = useGenerateNonceQuery();
  const { mutateAsync } = useNonceVerificationMutation();
  const { signInWithEthereum } = useSignInWithEthereum();

  const openWeb3Modal = useCallback(() => open(), [open]);

  const handleSignAndVerification = async () => {
    if (nonceResponse?.nonce) {
      const verifyReqBody = await signInWithEthereum(nonceResponse?.nonce);
      if (verifyReqBody) {
        void mutateAsync(verifyReqBody)
          .then(() => setShowConnectWallet(true))
          .catch(error => {
            notification.error({ message: unwrapErrorMessage(error) });
          });
      }
    }
  };

  const disconnectWallet = useCallback(() => disconnect(), [disconnect]);

  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  useEffect(() => {
    const suitableChainId: number = isProduction ? polygon.id : goerli.id;
    if (chain?.id !== suitableChainId) {
      switchNetwork?.(suitableChainId);
    }
  }, [chain, switchNetwork]);

  useEffect(() => {
    setShowWrapperContent(false);
    setShowConnectWallet(false);
    setShowNonce(false);
    setShowError(false);
    if (isConnected && account) {
      if (account.wallet_address) {
        if (account.wallet_address === address) {
          setShowWrapperContent(true);
        } else {
          setShowError(true);
        }
      } else {
        setShowNonce(true);
      }
    } else {
      setShowConnectWallet(true);
      setShowNonce(false);
      setShowError(false);
    }
  }, [account, address, isConnected]);

  return (
    <div className={className}>
      {isConnected && address && (
        <div className="mb-2 flex items-center justify-between gap-4 rounded-full bg-white/5 p-2 pl-6">
          <div>
            <span className="text-gray-400">Wallet Address:</span>{' '}
            {shortenAddress(address)}
          </div>
          <Button variant="alternative" onClick={disconnectWallet}>
            Disconnect
          </Button>
        </div>
      )}
      {showWrapperContent && <div>{children}</div>}
      {showError && (
        <Card>
          <p>
            This wallet is not synced with the current account, please switch
            back to your previously used wallet. In order to use a new wallet,
            contact us.
          </p>
          <p>
            previously used wallet address:{' '}
            {shortenAddress(account?.wallet_address ?? '')}
          </p>
        </Card>
      )}
      {showConnectWallet && (
        <Card className="flex flex-col items-center gap-12">
          <Wallet className="mobile:w-24" />
          <div className="text-center">
            <h2 className="mb-8 text-lg font-semibold">
              Payment by Wisdomise Token
            </h2>
            <p className="text-gray-400">
              Your Wisdomise Tokens will not be deducted, you will only need to
              hold the tokens in your wallet for a the subscription period in
              order to gain access.
            </p>
          </div>
          <Button onClick={openWeb3Modal}>Connect Wallet</Button>
          {isConnected && <div>Connected to {activeConnector?.name}</div>}
        </Card>
      )}
      {showNonce && (
        <Card className="flex flex-col items-center gap-12 text-center">
          <Key className="mobile:w-24" />
          <h2 className="w-[17rem] text-lg">
            Please sign this nonce with your private key
          </h2>
          <div className="w-full rounded-xl bg-white/10 py-6 text-lg font-semibold text-white/60">
            {nonceResponse?.nonce}
          </div>
          <Button onClick={handleSignAndVerification}>Sign and Verify</Button>
        </Card>
      )}
    </div>
  );
}
