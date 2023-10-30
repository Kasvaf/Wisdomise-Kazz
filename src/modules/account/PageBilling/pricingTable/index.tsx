import { clsx } from 'clsx';
import { useCallback, useState } from 'react';
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
  const { data, isLoading } = usePlansQuery();
  const [currentPeriod, setCurrentPeriod] = useState<PlanPeriod>('MONTHLY');

  const handleUpdatePlan = useCallback(() => onResolve?.(true), [onResolve]);

  return (
    <PageWrapper loading={isLoading}>
      <div className="flex flex-col items-center">
        <div className="mb-4 rounded-full border border-gray-700 bg-white/5 p-1">
          {(['MONTHLY', 'YEARLY'] as const).map(period => (
            <button
              key={period}
              // eslint-disable-next-line react/jsx-no-bind
              onClick={() => setCurrentPeriod(period)}
              className={clsx(
                'rounded-full px-8 py-2 capitalize text-gray-400 transition-colors',
                currentPeriod === period && 'bg-white !text-black',
              )}
            >
              {period.toLowerCase()}
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
                onPlanUpdate={handleUpdatePlan}
              />
            ))}
        </div>
      </div>
    </PageWrapper>
  );
}
