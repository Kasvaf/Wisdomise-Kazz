import { useDisconnect } from 'wagmi';
import { type ReactNode, useEffect } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import Card from 'shared/Card';
import { useAccountQuery } from 'api';
import { useGenerateNonceQuery, useNonceVerificationMutation } from 'api/defi';
import { shortenAddress } from 'utils/shortenAddress';
import { Button } from 'shared/v1-components/Button';
import { useActiveWallet } from 'api/chains';
import Spinner from 'shared/Spinner';
import { BtnAppKitWalletConnect } from 'modules/base/wallet/BtnAppkitWalletConnect';
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
  const { t } = useTranslation('wisdomise-token');

  const wallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  const { data: account, isLoading: isAccountLoading } = useAccountQuery();
  const { mutateAsync: mutateNonceVerification, isPending: isVerifying } =
    useNonceVerificationMutation();
  const { signInWithEthereum, isPending } = useSignInWithEthereum();
  const { data: nonceResponse, refetch } = useGenerateNonceQuery();

  const handleSignAndVerification = async () => {
    if (!nonceResponse?.nonce) return;

    const verifyReqBody = await signInWithEthereum(nonceResponse.nonce);
    if (!verifyReqBody) return;

    await mutateNonceVerification(verifyReqBody); // invalidates account's query
  };

  useEffect(() => {
    if (wallet.connected && account && !account.wallet_address) {
      void refetch();
    }
  }, [wallet.connected, account, refetch]);

  if (isAccountLoading) {
    return (
      <div className={clsx('my-4 flex items-center justify-center', className)}>
        <Spinner />
      </div>
    );
  }

  const nonceContent = (
    <Card className="flex flex-col items-center gap-12 text-center">
      <Key className="mobile:w-24" />
      <h2 className="w-[17rem] text-lg">{t('connect-wallet.verify-nonce')}</h2>
      <div className="w-full rounded-xl bg-v1-surface-l4 py-6 text-lg font-semibold text-white/60">
        {nonceResponse?.nonce}
      </div>
      <div className="flex flex-wrap gap-4">
        <Button
          onClick={handleSignAndVerification}
          loading={isPending || isVerifying}
        >
          {t('connect-wallet.sign')}
        </Button>
        <Button variant="outline" onClick={() => disconnect()}>
          {t('connect-wallet.disconnect')}
        </Button>
      </div>
    </Card>
  );

  const errorContent = (
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
        {shortenAddress(wallet.address)}
      </p>
      <Button className="mt-3" variant="outline" onClick={() => disconnect()}>
        {t('connect-wallet.disconnect')}
      </Button>
    </Card>
  );

  const connectWalletContent = (
    <Card className="flex flex-col items-center gap-12">
      <Wallet className="mobile:w-24" />
      <div className="text-center">
        <h2 className="mb-8 text-lg font-semibold">{title}</h2>
        <p className="text-gray-400">{description}</p>
      </div>
      <BtnAppKitWalletConnect network="polygon" size="xl" variant="primary" />
    </Card>
  );

  return (
    <div className={clsx('text-white', className)}>
      {wallet.connected && account ? (
        account.wallet_address ? (
          account.wallet_address.toLowerCase() ===
          wallet.address?.toLowerCase() ? (
            <div>{children}</div>
          ) : (
            errorContent
          )
        ) : (
          nonceContent
        )
      ) : (
        connectWalletContent
      )}
    </div>
  );
}
