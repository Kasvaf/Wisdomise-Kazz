import { useAccountQuery } from 'api';
import { useTranslation } from 'react-i18next';
import Button from 'shared/Button';
import Card from 'shared/Card';
import CopyInputBox from 'shared/CopyInputBox';
import { useDisconnect } from 'wagmi';
import { ReactComponent as WalletIcon } from './icons/wallet.svg';

export default function Wallet() {
  const { t } = useTranslation('wisdomise-token');
  const { data: account } = useAccountQuery();
  const { disconnect } = useDisconnect();

  return (
    <Card className="!bg-v1-surface-l2 relative flex flex-col justify-between gap-8">
      <WalletIcon className="absolute top-0 right-0 m-7" />
      <h2 className="mb-2 font-medium text-2xl">{t('wallet.title')}</h2>
      <div className="flex items-end gap-6 max-md:flex-wrap">
        <CopyInputBox
          className="-mb-6 grow"
          label={t('wallet.connected-wallet')}
          style="alt"
          value={account?.wallet_address}
        />
        <Button
          className="-mb-1 max-md:w-full"
          onClick={() => disconnect()}
          variant="alternative"
        >
          {t('wallet.disconnect')}
        </Button>
      </div>
    </Card>
  );
}
