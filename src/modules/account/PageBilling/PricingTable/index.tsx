import { clsx } from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePlansQuery, useSubscription } from 'api';
import { type PlanPeriod } from 'api/types/subscription';
import PricingCard from './PricingCard';

interface PricingTableProps {
  isRenew?: boolean;
  isUpdate?: boolean;
  isTokenUtility?: boolean;
  onResolve?: (result: boolean) => void;
}

export default function PricingTable({
  isRenew,
  isUpdate,
  isTokenUtility,
  onResolve,
}: PricingTableProps) {
  const { t } = useTranslation('billing');
  const { plan, isFreePlan } = useSubscription();
  const { data } = usePlansQuery();
  const [currentPeriod, setCurrentPeriod] = useState<PlanPeriod>(
    isRenew || isFreePlan || !plan ? 'YEARLY' : plan.periodicity,
  );

  return (
    <>
      <div className={clsx('flex flex-col', (isRenew || isUpdate) && 'mt-7')}>
        <div className="mb-8 flex items-center justify-center mobile:mb-4 mobile:flex-col mobile:gap-4">
          {!isTokenUtility && (
            <div className="flex gap-3 rounded-xl bg-white/10 p-2 mobile:w-full">
              {(['YEARLY', 'MONTHLY'] as const).map(period => (
                <button
                  key={period}
                  onClick={() => setCurrentPeriod(period)}
                  className={clsx(
                    'w-44 rounded-xl bg-white/10 px-8 py-2 text-sm text-white transition-colors disabled:opacity-60',
                    currentPeriod === period &&
                      '!bg-white font-medium !text-black',
                  )}
                >
                  {period === 'MONTHLY'
                    ? t('periodicity.month.title')
                    : t('periodicity.year.title')}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="-mx-6 flex grow justify-center gap-6 overflow-auto px-6 mobile:justify-start">
          {data?.results
            .filter(x => x.periodicity === currentPeriod)
            .map(plan => (
              <PricingCard
                plan={plan}
                key={plan.key}
                isRenew={isRenew}
                isUpdate={isUpdate}
                isTokenUtility={isTokenUtility}
                className="col-span-1"
                onPlanUpdate={() => onResolve?.(true)}
              />
            ))}
        </div>
      </div>
    </>
  );
}
