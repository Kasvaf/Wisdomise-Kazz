import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type FinancialProduct } from 'api/types/financialProduct';
import { useExchangeAccountsQuery } from 'api';
import Button from 'shared/Button';
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
  const walletRef =
    wallet === 'wisdomise'
      ? {
          title: 'Wisdomise',
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

  return (
    <div>
      <MinMaxInfo min={fp.min_deposit} max={fp.max_deposit} />

      <section className="mt-9 flex items-center py-3">
        <ExchangeButton
          walletType={wallet === 'wisdomise' ? 'Wisdomise' : 'Binance'}
          walletName={walletRef?.title}
          className="!h-[84px] !w-full"
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
          disabled={false}
          loading={isCreating}
        >
          {t('fp-activation.btn-create-fp')}
        </Button>
      </div>
    </div>
  );
};

export default StepConfirm;
