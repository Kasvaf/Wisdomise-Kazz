import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { type SubscriptionPlan } from 'api/types/subscription';
import { ReactComponent as FalseIcon } from './false.svg';
import { ReactComponent as TrueIcon } from './true.svg';

type PeriodType = 'YEARLY' | 'MONTHLY';

export function PeriodToggle({
  className,
  value,
  onChange,
  plans,
}: {
  className?: string;
  value?: PeriodType;
  onChange?: (newValue: PeriodType) => void;
  plans?: SubscriptionPlan[];
}) {
  const { t } = useTranslation('billing');
  const yearlyOff = useMemo(() => {
    if (!plans || plans.length === 0) return 0;
    const monthlyPlans = plans.filter(x => x.periodicity === 'MONTHLY');
    const yearlyPlans = plans.filter(x => x.periodicity === 'YEARLY');
    const percent = Math.max(
      ...monthlyPlans.map(monthlyPlan => {
        const yearlyPlan = yearlyPlans.find(x => x.name === monthlyPlan.name);
        if (yearlyPlan) {
          const saves = (monthlyPlan.price ?? 0) * 12 - (yearlyPlan.price ?? 0);
          if (saves > 0) {
            return (saves / ((monthlyPlan.price ?? 0) * 12)) * 100;
          }
        }
        return 0;
      }),
    );
    return Math.floor(percent);
  }, [plans]);
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
        {yearlyOff > 0 && (
          <span className="inline-flex h-6 items-center rounded-full bg-wsdm-gradient px-3 text-xs font-medium">
            {t('periodicity.off', {
              replace: {
                off: yearlyOff,
              },
            })}
          </span>
        )}
      </button>
    </div>
  );
}
