import { bxCameraMovie, bxPlus } from 'boxicons-quasar';
import { useExchangeAccountsQuery, type ExchangeAccount } from 'api';
import { type FinancialProduct } from 'api/types/financialProduct';
import Icon from 'shared/Icon';
import Button from 'shared/Button';
import Spinner from 'shared/Spinner';
import MinMaxInfo from './MinMaxInfo';
import ExchangeButton from './ExchangeButton';

const StepChooseWallet: React.FC<{
  financialProduct: FinancialProduct;
  selected?: ExchangeAccount;
  onSelect: (val: ExchangeAccount) => void;
  onAddExchange: () => void;
  onContinue: () => void;
}> = ({
  financialProduct: fp,
  selected,
  onSelect,
  onAddExchange,
  onContinue,
}) => {
  const { data: wallets, isLoading } = useExchangeAccountsQuery();

  return (
    <div>
      <MinMaxInfo min={fp.min_deposit} max={fp.max_deposit} />

      <section className="mt-9">
        <div className="mb-3 flex items-center justify-between">
          <div>Choose your wallet to continue:</div>
          <a className="flex items-center">
            <Icon name={bxCameraMovie} className="mr-1" />
            How to Add Binance Wallet
          </a>
        </div>

        <div className="-mx-6 overflow-x-scroll py-3">
          {isLoading ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : (
            <>
              <div className="flex h-[84px] shrink-0 items-center gap-2 pl-6">
                {wallets?.map(w => (
                  <ExchangeButton
                    key={w.key}
                    selected={selected?.key === w.key}
                    walletName={w.title}
                    available={w.available}
                    onClick={() => onSelect(w)}
                  />
                ))}
                {!wallets?.length && (
                  <ExchangeButton selected={true} onClick={onAddExchange} />
                )}

                <Button
                  variant="alternative"
                  className="h-full !px-4"
                  onClick={onAddExchange}
                >
                  <Icon name={bxPlus} />
                </Button>
                <div className="h-full w-4 shrink-0" />
              </div>
            </>
          )}
        </div>
      </section>

      <div className="mt-6 flex justify-center">
        <Button
          variant="primary"
          className="w-[280px] mobile:w-full"
          onClick={onContinue}
          disabled={!selected}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default StepChooseWallet;
