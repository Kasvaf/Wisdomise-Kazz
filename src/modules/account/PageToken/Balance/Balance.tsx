import { bxRefresh } from 'boxicons-quasar';
import { clsx } from 'clsx';
import BuyWSDM from 'modules/account/PageToken/Balance/BuyWSDM';
import { useWSDMBalance } from 'modules/account/PageToken/web3/wsdm/contract';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'shared/Button';
import Card from 'shared/Card';
import Icon from 'shared/Icon';
import { addComma } from 'utils/numbers';
import { ReactComponent as WSDMIcon } from '../icons/wsdm-token.svg';

export default function Balance() {
  const { t } = useTranslation('wisdomise-token');
  const { data: wsdmBalance, refetch, isLoading } = useWSDMBalance();
  const [isSpinning, setIsSpinning] = useState(false);

  return (
    <Card className="!bg-v1-surface-l2 relative flex flex-col items-start justify-between gap-8">
      <WSDMIcon className="absolute top-0 right-0" />
      <div>
        <h2 className="mb-2 font-medium text-2xl">{t('balance.title')}</h2>
        <p className="text-sm text-white/40 max-md:w-48">
          {t('balance.description')}
        </p>
      </div>
      <Button
        className="!px-4 !py-2"
        disabled={isLoading}
        onClick={() => {
          setIsSpinning(true);
          void refetch();
          setTimeout(() => setIsSpinning(false), 1000);
        }}
        variant="alternative"
      >
        <Icon
          className={clsx('me-2', isSpinning && 'animate-spin')}
          name={bxRefresh}
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
            <span className="text-green-400 text-xl">WSDM</span>
          </div>
        </div>
        <BuyWSDM className="self-end" />
      </div>
    </Card>
  );
}
