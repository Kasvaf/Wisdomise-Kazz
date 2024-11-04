import { type ComponentProps } from 'react';
import { useHasFlag } from 'api';
import { ConfirmationWidget } from 'modules/insight/PageMarketPulse/components/ConfirmationWidget';
import { SeeMoreLink } from './SeeMoreLink';

export function RsiConfirmationWidget(
  props: Omit<
    ComponentProps<typeof ConfirmationWidget>,
    'indicator' | 'headerActions'
  >,
) {
  const hasFlag = useHasFlag();
  if (!hasFlag('/coin-radar/technical-radar')) return null;
  return (
    <ConfirmationWidget
      {...props}
      indicator="rsi"
      headerActions={<SeeMoreLink to="/coin-radar/technical-radar" />}
    />
  );
}
