import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { ReactComponent as CancelIcon } from './cancel.svg';
import { ReactComponent as TrustIcon } from './trust.svg';
import { ReactComponent as SecureIcon } from './secure.svg';

export function SubscriptionFeatures({ className }: { className?: string }) {
  const { t } = useTranslation('billing');
  return (
    <ul
      className={clsx(
        'flex flex-wrap items-center justify-center gap-6 text-base font-normal mobile:gap-2',
        className,
      )}
    >
      <li>
        <CancelIcon className="mr-2 inline-block" />
        {t('features.cancel')}
      </li>
      <li>
        <TrustIcon className="mr-2 inline-block" />
        {t('features.trust')}
      </li>
      <li>
        <SecureIcon className="mr-2 inline-block" />
        {t('features.secure')}
      </li>
    </ul>
  );
}
