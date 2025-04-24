import { bxRefresh } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { clsx } from 'clsx';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import { addComma } from 'utils/numbers';
import Card from 'shared/Card';
import { useWsdmBalance } from 'modules/account/PageToken/web3/wsdm/contract';
import BuyWSDM from 'modules/account/PageToken/Balance/BuyWSDM';
import { ReactComponent as WSDMIcon } from '../icons/wsdm-token.svg';

export default function Balance() {
  const { t } = useTranslation('wisdomise-token');
  const { data: wsdmBalance, refetch, isLoading } = useWsdmBalance();
  const [isSpinning, setIsSpinning] = useState(false);

  return (
    <Card className="relative flex flex-col items-start justify-between gap-8  !bg-v1-surface-l2">
      <WSDMIcon className="absolute right-0 top-0" />
      <div>
        <h2 className="mb-2 text-2xl font-medium">{t('balance.title')}</h2>
        <p className="text-sm text-white/40 max-md:w-48">
          {t('balance.description')}
        </p>
      </div>
      <Button
        variant="alternative"
        disabled={isLoading}
        onClick={() => {
          setIsSpinning(true);
          void refetch();
          setTimeout(() => setIsSpinning(false), 1000);
        }}
        className="!px-4 !py-2"
      >
        <Icon
          name={bxRefresh}
          className={clsx('me-2', isSpinning && 'animate-spin')}
        />
        {t('billing:token-modal.refresh')}
      </Button>
      <div className="flex w-full flex-col gap-4">
        <div>
          <div>{t('balance.subtitle')}</div>
          <div className="flex flex-wrap items-end gap-2">
            <span className="text-3xl">
              {addComma(Number(wsdmBalance?.value ?? 0n) / 10 ** 6)}
            </span>
            <span className="text-xl text-green-400">WSDM</span>
          </div>
        </div>
        <BuyWSDM className="self-end" />
      </div>
    </Card>
  );
}
