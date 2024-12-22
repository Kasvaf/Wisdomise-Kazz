import { type Indicator, type IndicatorConfirmation } from 'api/market-pulse';
import { ReactComponent as Icon } from './shine-star.svg';

export function ConfirmationAnalysis<I extends Indicator>({
  value,
}: {
  value: IndicatorConfirmation<I>;
}) {
  if (!value.analysis) return null;
  return (
    <div className="flex items-center justify-start gap-2 rounded-lg bg-v1-surface-l4 p-3 text-xs">
      <div className="flex size-6 shrink-0 items-center justify-center rounded bg-wsdm-gradient">
        <Icon />
      </div>
      <p>{value.analysis}</p>
    </div>
  );
}
