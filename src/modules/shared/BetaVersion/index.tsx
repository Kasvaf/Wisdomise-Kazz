import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { ReactComponent as BetaIcon } from './beta.svg';

export default function BetaVersion({ minimal }: { minimal?: boolean }) {
  const { t } = useTranslation('base');
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full bg-[#f1aa401a] px-3 py-1 text-xxs leading-none text-[#F1AA40]',
        minimal && 'w-[40px] !p-2',
      )}
    >
      {minimal ? (
        t('beta')
      ) : (
        <>
          <BetaIcon />
          {t('beta-version')}
        </>
      )}
    </span>
  );
}
