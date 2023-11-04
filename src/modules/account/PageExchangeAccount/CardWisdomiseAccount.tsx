import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { ReactComponent as LogoSvg } from 'assets/logo-horizontal-beta.svg';
import Card from 'shared/Card';
import { useActivePlan, useIsVerified, useSubscription } from 'api';

const CardWisdomiseAccount: React.FC<{ className?: string }> = ({
  className,
}) => {
  const { t } = useTranslation('external-accounts');
  const sub = useSubscription();
  const plan = useActivePlan(); // TODO: remove this once refactored in backend
  const { isLoading, identified, verified, addedWallet } = useIsVerified();
  const verifiedCount = isLoading
    ? '?'
    : (identified === 'VERIFIED' ? 1 : 0) +
      (verified === 'VERIFIED' ? 1 : 0) +
      (addedWallet ? 1 : 0);

  return (
    <Card className={className}>
      <h2 className="mb-8 text-base font-semibold">
        {t('page-accounts.wisdomise-account')}
      </h2>

      <div
        className={clsx(
          'flex flex-col items-stretch justify-between gap-8 sm:flex-row sm:gap-6',
          'rounded-3xl bg-black/20 px-6 py-4',
          'max-w-xl',
        )}
      >
        <div className="flex flex-col">
          <div className="mb-3 text-xs text-white/60">
            {t('account.account')}
          </div>
          <div className="h-full">
            <LogoSvg />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-3 text-xs text-white/60">
            {t('page-accounts.subscription')}
          </div>
          <div className="flex h-full items-center">
            {sub.title || plan.data?.name}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-3 text-xs text-white/60">{t('kyc:kyc')}</div>
          <div className="flex h-full items-center">{verifiedCount}/3</div>
        </div>
      </div>
    </Card>
  );
};

export default CardWisdomiseAccount;
