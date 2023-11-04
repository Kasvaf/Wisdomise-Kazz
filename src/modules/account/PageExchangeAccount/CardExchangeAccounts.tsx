import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('external-accounts');
  const { data, isLoading } = useExchangeAccountsQuery();
  const [ModalAdd, showModalAdd] = useModalAddExchangeAccount();

  return (
    <Card className={className}>
      <h2 className="mb-8 text-base font-semibold">
        {t('page-accounts.exchanges-title')}
      </h2>

      {isLoading ? (
        <Spinner />
      ) : data?.length ? (
        data?.map(acc => (
          <div
            key={acc.key}
            className={clsx(
              'flex flex-col items-stretch justify-between gap-8 sm:flex-row sm:gap-6',
              'mb-6 rounded-3xl bg-black/20 px-6 py-4',
              'max-w-xl',
            )}
          >
            <div className="flex grow flex-col">
              <div className="mb-3 text-xs text-white/60">
                {t('account.name')}
              </div>
              <div className="flex h-full items-center">{acc.title}</div>
            </div>

            <div className="flex flex-col sm:basis-[140px]">
              <div className="mb-3 text-xs text-white/60">
                {t('account.exchange')}
              </div>
              <div className="flex h-full items-center">
                <BinanceLogoSvg />
              </div>
            </div>

            <div className="flex flex-col sm:basis-[70px]">
              <div className="mb-3 text-xs text-white/60">
                {t('account.market')}
              </div>
              <div className="flex h-full items-center">{acc.market_name}</div>
            </div>

            <div className="flex flex-col sm:basis-[56px]">
              <div className="mb-3 text-xs text-white/60">
                {t('account.status')}
              </div>
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
          {t('page-accounts.empty-description')}
        </div>
      )}

      <div className="flex justify-end pt-8">
        {ModalAdd}
        <Button onClick={showModalAdd}>
          {t('page-accounts.btn-add-account')}
        </Button>
      </div>
    </Card>
  );
};

export default CardExchangeAccounts;
