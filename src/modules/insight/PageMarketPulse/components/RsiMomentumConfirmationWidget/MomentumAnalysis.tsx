import { type RsiMomentumConfirmation } from 'api/market-pulse';
import { ReactComponent as Logo } from './logo.svg';

export function MomentumAnalysis({
  value,
}: {
  value: RsiMomentumConfirmation;
}) {
  if (!value.analysis) return null;
  return (
    <div className="flex items-center justify-start gap-2 rounded-lg bg-v1-background-secondary/10 p-3 text-xs">
      <Logo />
      <p>{value.analysis}</p>
    </div>
  );
}
