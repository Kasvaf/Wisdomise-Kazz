import { clsx } from 'clsx';
import { Trans, useTranslation } from 'react-i18next';
import { useSubscription } from 'api';
import Button from 'modules/shared/Button';

export default function TrialBanner() {
  const { t } = useTranslation('billing');
  const { remaining, isTrialing } = useSubscription();

  if (!isTrialing) {
    return null;
  }

  return (
    <div
      className={clsx(
        'fixed inset-x-0 top-0 z-[2] flex w-full items-center justify-center text-white',
        'h-[8rem] md:h-14',
        remaining ? 'bg-[#4B175C]' : 'bg-[#5C173D]',
      )}
    >
      <div className="flex max-w-screen-2xl flex-col items-center justify-between gap-4 md:flex-row md:gap-10">
        <div className="mx-4 text-center leading-8 md:mx-0">
          <Trans i18nKey="banner.ends-in">
            Your trial subscription ends in
            <span className="mx-1 rounded-full border border-white/20 px-3 py-2">
              {{ remaining }}
            </span>
            days!
          </Trans>
        </div>

        <div className="flex w-full items-center gap-2 md:w-auto">
          <div className="hidden md:block">{t('banner.checkout-message')}</div>
          <Button
            size="small"
            to="/account/billing"
            className="mx-4 w-full md:mx-0 md:w-auto"
          >
            {t('banner.btn-subscription-plans')}
          </Button>
        </div>
      </div>
    </div>
  );
}
