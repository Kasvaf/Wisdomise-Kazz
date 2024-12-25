import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

export function PlanPrice({
  className,
  price,
  periodicity,
}: {
  className?: string;
  price: number;
  periodicity: string;
}) {
  const { t } = useTranslation('billing');
  return (
    <div className={clsx('flex gap-px text-2xl', className)}>
      <span className="text-white/50">$</span>
      <span className="font-semibold">
        {(periodicity === 'MONTHLY' ? price : price / 12).toFixed(2)}
      </span>
      <span>/</span>
      <div className="text-white/70">
        {price === 0 ? t('pricing-card.forever') : t('pricing-card.monthly')}
      </div>
    </div>
  );
}
