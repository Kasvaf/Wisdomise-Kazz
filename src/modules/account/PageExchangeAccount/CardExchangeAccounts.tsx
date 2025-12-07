import { useExchangeAccountsQuery } from 'api';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import Button from 'shared/Button';
import Card from 'shared/Card';
import Spinner from 'shared/Spinner';
import useModalAddExchangeAccount from '../useModalAddExchangeAccount';
import ButtonExchangeDelete from './ButtonExchangeDelete';

const CardExchangeAccounts: React.FC<{ className?: string }> = ({
  className,
}) => {
  const { t } = useTranslation('external-accounts');
  const { data, isLoading } = useExchangeAccountsQuery();
  const [ModalAdd, showModalAdd] = useModalAddExchangeAccount();

  return (
    <Card className={className}>
      <h2 className="mb-8 font-semibold text-base">
        {t('page-accounts.exchanges-title')}
      </h2>

      {isLoading ? (
        <Spinner />
      ) : data?.length ? (
        data?.map(acc => (
          <div
            className={clsx(
              'flex flex-col items-stretch justify-between gap-8 sm:flex-row sm:gap-6',
              'mb-6 rounded-xl bg-black/20 px-6 py-4',
              'max-w-2xl',
            )}
            key={acc.key}
          >
            <div className="flex grow flex-col">
              <div className="mb-3 text-white/60 text-xs">
                {t('account.name')}
              </div>
              <div className="flex h-full items-center">{acc.title}</div>
            </div>

            <div className="flex flex-col sm:basis-[140px]">
              <div className="mb-3 text-white/60 text-xs">
                {t('account.exchange')}
              </div>
              <div className="flex h-full items-center">
                {/* <BinanceLogoSvg /> */}
              </div>
            </div>

            <div className="flex flex-col sm:basis-[70px]">
              <div className="mb-3 text-white/60 text-xs">
                {t('account.market')}
              </div>
              <div className="flex h-full items-center">{acc.market_name}</div>
            </div>

            <div className="flex flex-col sm:basis-[56px]">
              <div className="mb-3 text-white/60 text-xs">
                {t('account.status')}
              </div>
              <div className="flex h-full items-center">
                {/* {acc.status === 'RUNNING' ? ( */}
                {/*   <Badge color="green" label="Running" /> */}
                {/* ) : ( */}
                {/*   <Badge color="grey" label="Inactive" /> */}
                {/* )} */}
              </div>
            </div>

            <div className="flex flex-col sm:basis-[24px]">
              <div className="mb-3 text-white/60 text-xs max-md:hidden">
                &nbsp;
              </div>
              <div className="flex h-full items-center justify-center">
                <ButtonExchangeDelete account={acc} />
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-slate-400 text-sm">
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
