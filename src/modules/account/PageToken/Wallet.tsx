import { useDisconnect } from 'wagmi';
import { useTranslation } from 'react-i18next';
import CopyInputBox from 'shared/CopyInputBox';
import Button from 'shared/Button';
import Card from 'shared/Card';
import { useAccountQuery } from 'api';
import { ReactComponent as WalletIcon } from './icons/wallet.svg';

export default function Wallet() {
  const { t } = useTranslation('wisdomise-token');
  const { data: account } = useAccountQuery();
  const { disconnect } = useDisconnect();

  return (
    <Card className="relative flex flex-col justify-between gap-8">
      <WalletIcon className="absolute right-0 top-0 m-7" />
      <h2 className="mb-2 text-2xl font-medium">My Wallet</h2>
      <div className="flex items-end gap-6">
        <CopyInputBox
          className="-mb-6 grow"
          value={account?.wallet_address}
          label="Connected Wallet"
          style="alt"
        />
        <Button
          className="-mb-1"
          variant="alternative"
          onClick={() => disconnect()}
        >
          {t('connect-wallet.disconnect')}
        </Button>
      </div>
    </Card>
  );
}
