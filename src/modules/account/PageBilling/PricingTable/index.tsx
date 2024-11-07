import { clsx } from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePlansQuery, useSubscription } from 'api';
import { type PlanPeriod } from 'api/types/subscription';
import { ReactComponent as CancelIcon } from '../images/cancel.svg';
import { ReactComponent as TrustIcon } from '../images/trust.svg';
import { ReactComponent as SecureIcon } from '../images/secure.svg';
import { SubscriptionMethods } from './SubscriptionMethods';
import { PeriodToggle } from './PeriodToggle';
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
        <div className="mb-10 text-center">
          <h1 className="text-xl font-medium text-v1-content-primary">
            {t('plans.title')}
          </h1>
          <p className="mt-2 text-base font-normal text-v1-content-secondary">
            {t('plans.subtitle')}
          </p>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-6 text-base font-normal mobile:gap-2">
            <li>
              <CancelIcon className="mr-2 inline-block" />
              {t('plans.features.cancel')}
            </li>
            <li>
              <TrustIcon className="mr-2 inline-block" />
              {t('plans.features.trust')}
            </li>
            <li>
              <SecureIcon className="mr-2 inline-block" />
              {t('plans.features.secure')}
            </li>
          </ul>
        </div>
        <div className="mb-8 flex items-center justify-center">
          {!isTokenUtility && (
            <div className="flex items-center justify-center gap-3 rounded-full border border-white/10 bg-white/5 p-4 backdrop-blur-sm mobile:w-full">
              <PeriodToggle value={currentPeriod} onChange={setCurrentPeriod} />
            </div>
          )}
        </div>
        <div className="-mx-6 mb-14 flex grow justify-center gap-6 overflow-auto px-6 mobile:justify-start">
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
