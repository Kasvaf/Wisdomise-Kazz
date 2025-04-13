import { type Coin, type NetworkSecurity } from 'api/types/shared';
import { CoinSecurityDetails } from './CoinSecurityDetails';
import { CoinLabel } from './CoinLabel';

export function CoinSecurityLabel({
  className,
  coin,
  value,
  mini,
  clickable,
}: {
  className?: string;
  coin: Coin;
  value?: NetworkSecurity[] | null;
  mini?: boolean;
  clickable?: boolean;
}) {
  const securityStatus =
    value?.length && (value ?? []).every(r => r.label.trusted)
      ? 'trusted'
      : (value ?? []).reduce((p, r) => p + (r.label.risk ?? 0), 0) > 0
      ? 'risk'
      : (value ?? []).reduce((p, r) => p + (r.label.warning ?? 0), 0)
      ? 'warning'
      : null;
  if (!securityStatus) return null;
  return (
    <CoinLabel
      value={securityStatus}
      mini={mini}
      popup={
        clickable ? <CoinSecurityDetails coin={coin} value={value} /> : false
      }
      className={className}
    />
  );
}
