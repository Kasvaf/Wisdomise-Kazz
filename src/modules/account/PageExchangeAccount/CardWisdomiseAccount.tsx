import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import Card from 'shared/Card';
import { useSubscription } from 'api';

const CardWisdomiseAccount: React.FC<{ className?: string }> = ({
  className,
}) => {
  const { t } = useTranslation('external-accounts');
  const sub = useSubscription();

  return (
    <Card className={className}>
      <h2 className="mb-8 text-base font-semibold">
        {t('page-accounts.wisdomise-account')}
      </h2>

      <div
        className={clsx(
          'flex flex-col items-stretch justify-between gap-8 sm:flex-row sm:gap-6',
          'rounded-xl bg-black/20 px-6 py-4',
          'max-w-xl',
        )}
      >
        <div className="flex flex-col">
          <div className="mb-3 text-xs text-white/60">
            {t('account.account')}
          </div>
          <div className="h-full">
            {/* <LogoSvg /> */}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-3 text-xs text-white/60">
            {t('page-accounts.subscription')}
          </div>
          <div className="flex h-full items-center">{sub.title}</div>
        </div>
      </div>
    </Card>
  );
};

export default CardWisdomiseAccount;
