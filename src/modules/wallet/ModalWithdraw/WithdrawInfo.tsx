import type React from 'react';
import { useTranslation } from 'react-i18next';
import { type Network } from 'api/types/NetworksResponse';
import WithdrawAmountBox from './WthdrawAmmountBox';

export interface WithdrawInfoProps {
  crypto: string;
  network?: Network;
  amount: number;
  wallet: string;
  fee: number;
  source: string;
}

const WithdrawInfo: React.FC<WithdrawInfoProps> = ({
  crypto,
  network,
  amount,
  wallet,
  fee,
  source,
}) => {
  const { t } = useTranslation('wallet');

  return (
    <>
      <WithdrawAmountBox crypto={crypto} network={network} amount={amount} />
      <div className="my-4 px-6">
        <div className="mb-4 flex flex-wrap items-center justify-between border-b border-white/5 pb-4">
          <div className="text-xs">{t('title')}</div>
          <div className="text-[10px]">{wallet}</div>
        </div>
        <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-4">
          <div>{t('withdraw-info.fee')}</div>
          <div className="flex items-center">
            <div>{fee}</div>
            <div className="ml-1 text-[10px] text-white/80">{crypto}</div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>{t('withdraw-info.source')}</div>
          <div className="capitalize">
            {t('withdraw-info.source-value', { source: source.toLowerCase() })}
          </div>
        </div>
      </div>
    </>
  );
};

export default WithdrawInfo;
