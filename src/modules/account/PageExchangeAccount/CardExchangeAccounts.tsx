import { clsx } from 'clsx';
import { ReactComponent as BinanceLogoSvg } from 'assets/logo-binance.svg';
import Card from 'shared/Card';
import Badge from 'modules/shared/Badge';
import Button from 'modules/shared/Button';
import { useExchangeAccountsQuery } from 'api';
import Spinner from 'modules/shared/Spinner';
import useModalAddExchangeAccount from '../useModalAddExchangeAccount';

const CardExchangeAccounts: React.FC<{ className?: string }> = ({
  className,
}) => {
  const { data, isLoading } = useExchangeAccountsQuery();
  const [ModalAdd, showModalAdd] = useModalAddExchangeAccount();

  return (
    <Card className={className}>
      <h2 className="mb-8 text-base font-semibold">My Exchange Accounts</h2>

      {isLoading ? (
        <Spinner />
      ) : data?.length ? (
        data?.map(acc => (
          <div
            key={acc.key}
            className={clsx(
              'flex flex-col items-stretch justify-between gap-8 sm:flex-row sm:gap-6',
              'rounded-3xl bg-black/20 px-6 py-4',
              'max-w-xl',
            )}
          >
            <div className="flex flex-col">
              <div className="mb-3 text-xs text-white/60">Account Name</div>
              <div className="flex h-full items-center">{acc.title}</div>
            </div>

            <div className="flex flex-col">
              <div className="mb-3 text-xs text-white/60">Exchange</div>
              <div className="flex h-full items-center">
                <BinanceLogoSvg />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="mb-3 text-xs text-white/60">Market</div>
              <div className="flex h-full items-center">{acc.market_name}</div>
            </div>

            <div className="flex flex-col">
              <div className="mb-3 text-xs text-white/60">Status</div>
              <div className="flex h-full items-center">
                {acc.status === 'RUNNING' ? (
                  <Badge color="green" label="Running" />
                ) : (
                  <Badge color="grey" label="Inactive" />
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-sm text-slate-400">
          You have not added any external exchange account yet.
        </div>
      )}

      <div className="flex justify-end pt-8">
        {ModalAdd}
        <Button onClick={showModalAdd}>Add Account</Button>
      </div>
    </Card>
  );
};

export default CardExchangeAccounts;
