import { clsx } from 'clsx';
import { useCallback, useState } from 'react';
import { usePlansQuery } from 'api';
import { type PlanPeriod } from 'api/types/subscription';
import Spinner from 'shared/Spinner';
import PricingCard from './PricingCard';

const TabButton: React.FC<{
  title: string;
  value: PlanPeriod;
  onClick: (val: PlanPeriod) => void;
  active: PlanPeriod;
}> = ({ title, value, onClick, active }) => (
  <button
    onClick={useCallback(() => onClick(value), [onClick, value])}
    className={clsx(
      'rounded-full px-8 py-2 text-gray-400 transition-colors',
      active === value && 'bg-white !text-black',
    )}
  >
    {title}
  </button>
);

export default function PricingTable() {
  const [currentPeriod, setCurrentPeriod] = useState<PlanPeriod>('MONTHLY');
  const { data, isLoading } = usePlansQuery(undefined, {
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex h-full justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 rounded-full border border-gray-700 bg-white/5 p-1">
        {['Monthly', 'Yearly'].map(key => (
          <TabButton
            key={key}
            active={currentPeriod}
            onClick={setCurrentPeriod}
            value={key.toUpperCase() as PlanPeriod}
            title={key}
          />
        ))}
      </div>
      <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {data?.results
          .filter(x => x.periodicity === currentPeriod)
          .map(plan => {
            return (
              <PricingCard className="col-span-1" key={plan.key} plan={plan} />
            );
          })}
      </div>
    </div>
  );
}
