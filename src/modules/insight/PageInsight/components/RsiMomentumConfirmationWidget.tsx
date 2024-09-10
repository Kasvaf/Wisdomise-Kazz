import { type ComponentProps } from 'react';
import { RsiMomentumConfirmationWidget as OriginalRsiMomentumConfirmationWidget } from 'modules/insight/PageMarketPulse/components/RsiMomentumConfirmationWidget';
import { useHasFlag } from 'api';
import { SeeMoreLink } from './SeeMoreLink';

export function RsiMomentumConfirmationWidget(
  props: ComponentProps<typeof OriginalRsiMomentumConfirmationWidget>,
) {
  const hasFlag = useHasFlag();
  if (!hasFlag('/insight/market-pulse')) return null;
  return (
    <OriginalRsiMomentumConfirmationWidget
      {...props}
      headerActions={<SeeMoreLink to="/insight/market-pulse" />}
    />
  );
}
