import { type FinancialProduct } from 'api/types/financialProduct';
import Button from 'shared/Button';
import MinMaxInfo from './MinMaxInfo';
import ExchangeButton from './ExchangeButton';

const StepConfirm: React.FC<{
  financialProduct: FinancialProduct;
  wallet: { title: string };
  onContinue: () => void;
}> = ({ financialProduct: fp, wallet, onContinue }) => {
  return (
    <div>
      <MinMaxInfo min={fp.min_deposit} max={fp.max_deposit} />

      <section className="mt-9 flex items-center py-3">
        <ExchangeButton
          walletName={wallet.title}
          className="!h-[84px] !w-full"
        />
      </section>

      <div className="mt-6 flex justify-center">
        <Button
          variant="primary"
          className="w-[280px] mobile:w-full"
          onClick={onContinue}
          disabled={false}
        >
          Create Financial Product
        </Button>
      </div>
    </div>
  );
};

export default StepConfirm;
