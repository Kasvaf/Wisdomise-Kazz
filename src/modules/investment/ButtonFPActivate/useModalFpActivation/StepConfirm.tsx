import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { bxInfoCircle } from 'boxicons-quasar';
import { type FinancialProduct } from 'api/types/financialProduct';
import { useExchangeAccountsQuery, useInvestorAssetStructuresQuery } from 'api';
import Button from 'shared/Button';
import Banner from 'shared/Banner';
import MinMaxInfo from './MinMaxInfo';
import ExchangeButton from './ExchangeButton';

const StepConfirm: React.FC<{
  financialProduct: FinancialProduct;
  wallet: string;
  onBack: () => void;
  onContinue: () => Promise<void>;
}> = ({ financialProduct: fp, wallet, onBack, onContinue }) => {
  const { t } = useTranslation('products');
  const { data: wallets } = useExchangeAccountsQuery();
  const { data: ias } = useInvestorAssetStructuresQuery();
  const walletRef =
    wallet === 'wisdomise'
      ? {
          title: 'Wisdomise',
          total_equity: ias?.[0]?.total_equity || 0,
        }
      : wallets?.find(x => x.key === wallet);

  const [isCreating, setIsCreating] = useState(false);
  const clickHandler = async () => {
    try {
      setIsCreating(true);
      await onContinue();
    } finally {
      setIsCreating(false);
    }
  };
  const balance = walletRef?.total_equity ?? 0;

  return (
    <div>
      <MinMaxInfo min={fp.min_deposit} max={fp.max_deposit} />

      <section className="mt-9 flex flex-col justify-center py-3">
        <h2 className="mb-3 text-base font-semibold">
          {t('fp-activation.your-wallet')}
        </h2>
        {balance < fp.min_deposit && (
          <Banner style="warn" icon={bxInfoCircle} className="mb-6">
            <span className="mr-1 font-semibold">
              {t('fp-activation.not-enough-balance.head')}
            </span>
            <span>
              {t('fp-activation.not-enough-balance.hint', {
                minInvestment: fp.min_deposit,
              })}
            </span>
          </Banner>
        )}

        <ExchangeButton
          walletType={wallet === 'wisdomise' ? 'Wisdomise' : 'Binance'}
          walletName={walletRef?.title}
          className="!h-[84px] !w-full"
          available={balance}
        />
      </section>

      <div className="mt-6 flex justify-center gap-4 mobile:flex-col-reverse">
        <Button
          variant="alternative"
          className="w-[280px] mobile:w-full"
          onClick={onBack}
          disabled={false}
          loading={isCreating}
        >
          {t('common:actions.back')}
        </Button>

        <Button
          variant="primary"
          className="w-[280px] mobile:w-full"
          onClick={clickHandler}
          disabled={balance < fp.min_deposit}
          loading={isCreating}
        >
          {t('fp-activation.btn-create-fp')}
        </Button>
      </div>
    </div>
  );
};

export default StepConfirm;
