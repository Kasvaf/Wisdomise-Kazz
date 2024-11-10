import { useTranslation } from 'react-i18next';
import { ReactComponent as CheckIcon } from './check.svg';

export function PlanFeatures({
  className,
  features,
}: {
  className?: string;
  features: string[];
}) {
  const { t } = useTranslation('billing');
  return (
    <div className={className}>
      <div className="mb-5 flex items-center justify-center gap-2">
        <div className="h-px grow bg-v1-border-disabled" />
        <span className="size-1 shrink-0 rounded-full bg-v1-content-primary" />
        <div className="shrink-0 text-xs text-white/50">
          {t('pricing-card.features')}
        </div>
        <span className="size-1 shrink-0 rounded-full bg-v1-content-primary" />
        <div className="h-px grow bg-v1-border-disabled" />
      </div>
      <ul className="space-y-4 text-xs">
        {features.map(feature => (
          <li key={feature} className="flex items-center gap-2 font-normal">
            <CheckIcon className="size-5 shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
