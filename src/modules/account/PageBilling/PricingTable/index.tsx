import { clsx } from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePlansQuery, useSubscription } from 'api';
import { type PlanPeriod } from 'api/types/subscription';
import { ReactComponent as FlashIcon } from '../images/flash.svg';
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
  const { plan } = useSubscription();
  const { data } = usePlansQuery();
  const [currentPeriod, setCurrentPeriod] = useState<PlanPeriod>(
    isRenew || isTokenUtility
      ? 'YEARLY'
      : plan
      ? plan.periodicity
      : data?.results.find(x => x.metadata?.most_popular)?.periodicity ??
        'YEARLY',
  );

  return (
    <>
      <div
        className={clsx(
          'flex max-w-full flex-col text-v1-content-primary',
          isUpdate || isRenew ? 'mt-8' : 'p-2',
        )}
      >
        {!(isRenew || isUpdate) && (
          <div className="mb-10 text-center">
            <div>
              <div className="mb-10 inline-flex shrink-0 items-center justify-center rounded-full bg-wsdm-gradient p-px">
                <div className="inline-flex size-full items-center justify-center rounded-full bg-v1-surface-l3/80  px-3 py-1 text-xs">
                  <FlashIcon className="w-4" /> {t('plans.badge')}
                </div>
              </div>
            </div>
            <h1 className="text-6xl font-medium text-v1-content-primary mobile:text-3xl">
              {t('plans.title')}
            </h1>
            <SubscriptionFeatures className="mt-8 mobile:mt-4" />
          </div>
        )}
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
        <div
          className={clsx(
            'flex grow justify-center gap-6 overflow-auto mobile:flex-col mobile:justify-start',
            !(isRenew || isUpdate) && 'mb-14',
          )}
        >
          {data?.results
            .filter(x => x.periodicity === currentPeriod)
            .filter(x => !isTokenUtility || x.token_hold_support)
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
        {!(isRenew || isUpdate) && (
          <div className="mb-12">
            <h2 className="mb-4 text-center text-white opacity-50">
              {t('plans.subscription-methods')}
            </h2>
            <SubscriptionMethods className="mx-auto w-full px-6" />
          </div>
        )}
      </div>
    </>
  );
}
