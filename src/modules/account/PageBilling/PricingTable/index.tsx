import { clsx } from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePlansQuery, useSubscription } from 'api';
import { type PlanPeriod } from 'api/types/subscription';
import PageWrapper from 'modules/base/PageWrapper';
import PricingCard from './PricingCard';

export interface PricingTableProps {
  isRenew?: boolean;
  isUpdate?: boolean;
  onResolve?: (result: boolean) => void;
}

export default function PricingTable({
  isRenew,
  isUpdate,
  onResolve,
}: PricingTableProps) {
  const { t } = useTranslation('billing');
  const { plan } = useSubscription();
  const { data, isLoading } = usePlansQuery();
  const [currentPeriod, setCurrentPeriod] = useState<PlanPeriod>(
    plan?.periodicity || 'MONTHLY',
  );

  return (
    <PageWrapper loading={isLoading}>
      <div className="flex flex-col">
        <div className="mb-8 flex items-center justify-start mobile:flex-col mobile:gap-4">
          <div className="mr-24">
            <p className="mb-4 text-xl font-semibold">
              {t('pricing-card.page-title')}
            </p>
            <p className="text-sm text-white/60">
              {t('pricing-card.page-subtitle')}
            </p>
          </div>

          <div className="flex rounded-full border border-white/20 bg-white/5 p-1 mobile:w-full">
            {(['MONTHLY', 'YEARLY'] as const).map(period => (
              <button
                key={period}
                onClick={() => setCurrentPeriod(period)}
                className={clsx(
                  'w-full rounded-full px-8 py-2 text-sm text-white transition-colors',
                  currentPeriod === period && 'bg-white !text-black',
                )}
              >
                {period === 'MONTHLY'
                  ? t('periodicity.month.title')
                  : t('periodicity.year.title')}
              </button>
            ))}
          </div>
        </div>
        <div className="-mx-6 flex justify-center gap-6 overflow-auto px-6 mobile:justify-start">
          {data?.results
            .filter(x => x.periodicity === currentPeriod)
            .map(plan => (
              <PricingCard
                plan={plan}
                key={plan.key}
                isRenew={isRenew}
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
