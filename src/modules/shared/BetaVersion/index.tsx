import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { ReactComponent as BetaIcon } from './beta.svg';

export default function BetaVersion({
  minimal,
  variant,
}: {
  minimal?: boolean;
  variant?: 'beta' | 'new';
}) {
  const { t } = useTranslation('base');
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full text-xxs leading-none',
        variant === 'new'
          ? 'bg-[#00A3FF1A]/10 text-[#00A3FF]'
          : 'bg-[#f1aa401a] text-[#F1AA40]',
        minimal && 'w-[40px] !p-2',
        minimal ? 'px-2 py-1' : 'px-3 py-1',
      )}
    >
      {minimal ? (
        variant === 'new' ? (
          t('new')
        ) : (
          t('beta')
        )
      ) : variant === 'new' ? (
        t('new')
      ) : (
        <>
          <BetaIcon />
          {t('beta-version')}
        </>
      )}
    </span>
  );
}
