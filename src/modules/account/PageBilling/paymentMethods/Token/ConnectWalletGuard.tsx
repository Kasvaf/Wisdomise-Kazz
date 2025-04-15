import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { type ReactNode, useCallback, useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import Card from 'shared/Card';
import Button from 'shared/Button';
import { useAccountQuery } from 'api';
import { useGenerateNonceQuery, useNonceVerificationMutation } from 'api/defi';
import { shortenAddress } from 'utils/shortenAddress';
import { defaultChain } from 'config/wagmi';
import { ReactComponent as Wallet } from '../../images/wallet.svg';
import { ReactComponent as Key } from '../../images/key.svg';
import useSignInWithEthereum from './useSiwe';

interface Props {
  children: ReactNode;
  className?: string;
  title: string;
  description: string;
}

export default function ConnectWalletGuard({
  children,
  className,
  title,
  description,
}: Props) {
  const { chain } = useNetwork();
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const { data: account } = useAccountQuery();
  const { switchNetwork } = useSwitchNetwork();
  const { isConnected, address } = useAccount();
  const { t } = useTranslation('wisdomise-token');
  const [showNonce, setShowNonce] = useState(false);
  const [showError, setShowError] = useState(true);
  const { mutateAsync } = useNonceVerificationMutation();
  const { signInWithEthereum } = useSignInWithEthereum();
  const { data: nonceResponse, refetch } = useGenerateNonceQuery();
  const [showWrapperContent, setShowWrapperContent] = useState(false);
  const [showConnectWallet, setShowConnectWallet] = useState(true);

  const handleSignAndVerification = async () => {
    if (nonceResponse?.nonce) {
      const verifyReqBody = await signInWithEthereum(nonceResponse?.nonce);
      if (verifyReqBody) {
        void mutateAsync(verifyReqBody).then(() => setShowConnectWallet(true));
      }
    }
  };

  const openWeb3Modal = useCallback(() => open(), [open]);

  useEffect(() => {
    const suitableChainId = defaultChain.id;
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
        void refetch();
      }
    } else {
      setShowConnectWallet(true);
      setShowNonce(false);
      setShowError(false);
    }
  }, [account, address, isConnected, refetch]);

  return (
    <div className={clsx(className, 'text-white')}>
      {showWrapperContent && <div>{children}</div>}
      {showError && (
        <Card>
          <p>{t('connect-wallet.not-sync')}</p>
          <p className="mt-3">
            <span className="text-v1-content-secondary">
              {t('connect-wallet.prev-wallet')}:{' '}
            </span>
            {shortenAddress(account?.wallet_address)}
          </p>
          <p>
            <span className="text-v1-content-secondary">
              {t('connect-wallet.current-wallet')}:{' '}
            </span>
            {shortenAddress(address)}
          </p>
          <Button
            className="mt-3"
            variant="alternative"
            onClick={() => disconnect()}
          >
            {t('connect-wallet.disconnect')}
          </Button>
        </Card>
      )}
      {showConnectWallet && (
        <Card className="flex flex-col items-center gap-12">
          <Wallet className="mobile:w-24" />
          <div className="text-center">
            <h2 className="mb-8 text-lg font-semibold">{title}</h2>
            <p className="text-gray-400">{description}</p>
          </div>
          <Button onClick={openWeb3Modal}>{t('connect-wallet.connect')}</Button>
        </Card>
      )}
      {showNonce && (
        <Card className="flex flex-col items-center gap-12 text-center">
          <Key className="mobile:w-24" />
          <h2 className="w-[17rem] text-lg">
            {t('connect-wallet.verify-nonce')}
          </h2>
          <div className="w-full rounded-xl bg-white/10 py-6 text-lg font-semibold text-white/60">
            {nonceResponse?.nonce}
          </div>
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleSignAndVerification}>
              {t('connect-wallet.sign')}
            </Button>
            <Button variant="alternative" onClick={() => disconnect()}>
              {t('connect-wallet.disconnect')}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
