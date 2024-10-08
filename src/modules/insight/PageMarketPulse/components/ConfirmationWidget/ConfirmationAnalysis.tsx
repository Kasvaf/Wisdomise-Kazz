import { type Indicator, type IndicatorConfirmation } from 'api/market-pulse';
import { ReactComponent as Logo } from './logo.svg';

export function ConfirmationAnalysis<I extends Indicator>({
  value,
}: {
  value: IndicatorConfirmation<I>;
}) {
  if (!value.analysis) return null;
  return (
    <div
      className="flex items-center justify-start gap-2 rounded-lg p-3 text-xs"
      style={{
        backgroundImage:
          'linear-gradient(87deg, #00A3FF -46.14%, #FF00C7 201.39%)',
      }}
    >
      <Logo />
      <p>{value.analysis}</p>
    </div>
  );
}
