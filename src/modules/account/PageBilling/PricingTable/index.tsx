import { clsx } from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePlansQuery, useSubscription } from 'api';
import { type PlanPeriod } from 'api/types/subscription';
import { SubscriptionMethods } from './SubscriptionMethods';
import { PeriodToggle } from './PeriodToggle';
import PricingCard from './PricingCard';
import { SubscriptionFeatures } from './SubscriptionFeatures';

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
  const { plan, level } = useSubscription();
  const { data } = usePlansQuery();
  const [currentPeriod, setCurrentPeriod] = useState<PlanPeriod>(
    isRenew || level === 0 || !plan ? 'YEARLY' : plan.periodicity,
  );

  return (
    <>
      <div className={clsx('flex flex-col', (isRenew || isUpdate) && 'mt-7')}>
        <div className="mb-10 text-center">
          <h1 className="text-xl font-medium text-v1-content-primary">
            {t('plans.title')}
          </h1>
          <p className="mt-2 text-base font-normal text-v1-content-secondary">
            {t('plans.subtitle')}
          </p>
          <SubscriptionFeatures className="mt-6" />
        </div>
        <div className="mb-8 flex items-center justify-center">
          {!isTokenUtility && (
            <PeriodToggle
              value={currentPeriod}
              onChange={setCurrentPeriod}
              className="mobile:w-full"
              plans={data?.results}
            />
          )}
        </div>
        <div className="-mx-6 mb-14 flex grow justify-center gap-6 overflow-auto px-6 mobile:flex-col mobile:justify-start">
          {data?.results
            .filter(x => x.periodicity === currentPeriod)
            .filter(
              x => !isTokenUtility || (isTokenUtility && x.token_hold_support),
            )
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
        <div className="mb-12 mobile:-mx-6">
          <h2 className="mb-4 text-center text-white opacity-50">
            {t('plans.subscription-methods')}
          </h2>
          <SubscriptionMethods className="mx-auto w-full px-6" />
        </div>
      </div>
    </>
  );
}
