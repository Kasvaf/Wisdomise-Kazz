import { clsx } from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePlansQuery } from 'api';
import { type PlanPeriod } from 'api/types/subscription';
import PageWrapper from 'modules/base/PageWrapper';
import PricingCard from './PricingCard';

export interface PricingTableProps {
  isUpdate?: boolean;
  onResolve?: (result: boolean) => void;
}

export default function PricingTable({
  isUpdate,
  onResolve,
}: PricingTableProps) {
  const { t } = useTranslation('billing');
  const { data, isLoading } = usePlansQuery();
  const [currentPeriod, setCurrentPeriod] = useState<PlanPeriod>('MONTHLY');

  return (
    <PageWrapper loading={isLoading}>
      <div className="flex flex-col items-center">
        <div className="mb-4 rounded-full border border-gray-700 bg-white/5 p-1">
          {(['MONTHLY', 'YEARLY'] as const).map(period => (
            <button
              key={period}
              onClick={() => setCurrentPeriod(period)}
              className={clsx(
                'rounded-full px-8 py-2 text-gray-400 transition-colors',
                currentPeriod === period && 'bg-white !text-black',
              )}
            >
              {period === 'MONTHLY'
                ? t('periodicity.month.title')
                : t('periodicity.year.title')}
            </button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
          {data?.results
            .filter(x => x.periodicity === currentPeriod)
            .map(plan => (
              <PricingCard
                plan={plan}
                key={plan.key}
                isUpdate={isUpdate}
                className="col-span-1"
                onPlanUpdate={() => onResolve?.(true)}
              />
            ))}
        </div>
      </div>
    </PageWrapper>
  );
}
