import { useTranslation } from 'react-i18next';
import { bxsBadgeCheck } from 'boxicons-quasar';
import { type SubscriptionPlan } from 'api/types/subscription';
import Icon from 'shared/Icon';
import freeSrc from './free.png';
import proSrc from './pro.png';

export function PlanHeader({
  className,
  plan,
}: {
  className?: string;
  plan: SubscriptionPlan;
}) {
  const { t } = useTranslation('billing');
  const logo = plan.name.toLowerCase().includes('free') ? freeSrc : proSrc;

  return (
    <div className={className}>
      <div className="mb-4 flex items-center gap-4">
        <img className="col-span-1 row-span-2 size-14 shrink-0" src={logo} />
        <h2 className="text-xl font-semibold capitalize text-white">
          {plan.name}
        </h2>
      </div>
      <div className="mb-4 flex gap-px text-2xl">
        <span className="text-white/50">$</span>
        <span className="font-semibold">
          {(plan.periodicity === 'MONTHLY'
            ? plan.price
            : plan.price / 12
          ).toFixed(2)}
        </span>
        <span>/</span>
        <div className="grow text-white/70">
          {plan.price === 0
            ? t('pricing-card.forever')
            : t('pricing-card.monthly')}
        </div>
        {plan.metadata?.most_popular === true && (
          <div className="flex shrink-0 items-center justify-center rounded-full bg-wsdm-gradient px-3 py-2 text-xs">
            {t('pricing-card.most_popular')}
          </div>
        )}
      </div>

      <div className="rounded-lg bg-white/5 p-4">
        <h3 className="mb-2 text-xs text-v1-content-primary">
          {t('pricing-card.key_benefits')}:
        </h3>
        <div className="space-y-4 text-xs leading-normal text-v1-content-primary">
          {plan.description
            .trim()
            .split('\n')
            .filter(x => !!x)
            .map((feat, i) => (
              <div key={`${feat}${i}`} className="flex items-center gap-2">
                <Icon name={bxsBadgeCheck} size={24} className="shrink-0" />
                <p>{feat}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
