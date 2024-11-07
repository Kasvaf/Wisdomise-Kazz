import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { ReactComponent as FalseIcon } from './false.svg';
import { ReactComponent as TrueIcon } from './true.svg';
import { ReactComponent as OffPercentIcon } from './off-percent.svg';

type PeriodType = 'YEARLY' | 'MONTHLY';

export function PeriodToggle({
  className,
  value,
  onChange,
}: {
  className?: string;
  value?: PeriodType;
  onChange?: (newValue: PeriodType) => void;
}) {
  const { t } = useTranslation('billing');
  return (
    <div
      className={clsx(
        'flex items-center justify-center gap-3 rounded-full border border-white/10 bg-white/5 p-4 backdrop-blur-sm',
        className,
      )}
    >
      <button
        className="flex items-center justify-center gap-4 text-base"
        onClick={() => onChange?.(value === 'MONTHLY' ? 'YEARLY' : 'MONTHLY')}
      >
        <span>{t('periodicity.month.title')}</span>
        <span className="relative h-[24px] w-[44px] overflow-hidden rounded-full">
          <FalseIcon
            className={clsx(
              'absolute inset-0 size-full transition-all duration-300',
              value !== 'MONTHLY' && 'translate-x-1/2 opacity-0',
            )}
          />
          <TrueIcon
            className={clsx(
              'absolute inset-0 size-full transition-all duration-300',
              value === 'MONTHLY' && '-translate-x-1/2 opacity-0',
            )}
          />
        </span>
        <span>{t('periodicity.year.title')}</span>
        <OffPercentIcon />
      </button>
    </div>
  );
}
