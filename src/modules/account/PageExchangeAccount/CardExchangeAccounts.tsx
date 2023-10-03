import { clsx } from 'clsx';
import { ReactComponent as BinanceLogoSvg } from 'assets/logo-binance-futures.svg';
import Card from 'shared/Card';
import Badge from 'modules/shared/Badge';
import Button from 'modules/shared/Button';
import useModalAddExchangeAccount from '../useModalAddExchangeAccount';

const CardExchangeAccounts: React.FC<{ className?: string }> = ({
  className,
}) => {
  const [ModalAdd, showModalAdd] = useModalAddExchangeAccount();

  return (
    <Card className={className}>
      <h2 className="mb-8 text-base font-semibold">My Exchange Accounts</h2>

      <div
        className={clsx(
          'flex flex-col items-stretch justify-between gap-8 sm:flex-row sm:gap-6',
          'rounded-3xl bg-black/20 px-6 py-4',
          'max-w-xl',
        )}
      >
        <div className="flex flex-col">
          <div className="mb-3 text-xs text-white/60">Account Name</div>
          <div className="h-full">My binance account</div>
        </div>

        <div className="flex flex-col">
          <div className="mb-3 text-xs text-white/60">Exchange</div>
          <div className="flex h-full items-center">
            <BinanceLogoSvg />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-3 text-xs text-white/60">Status</div>
          <div className="flex h-full items-center">
            <Badge color="green" label="Running" />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-8">
        {ModalAdd}
        <Button onClick={showModalAdd}>Add Account</Button>
      </div>
    </Card>
  );
};

export default CardExchangeAccounts;
