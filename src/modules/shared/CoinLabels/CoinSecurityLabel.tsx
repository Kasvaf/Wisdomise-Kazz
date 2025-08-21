import type { NetworkSecurity } from 'api/discovery';
import { CoinLabel } from './CoinLabel';
import { CoinSecurityDetails } from './CoinSecurityDetails';

export function CoinSecurityLabel({
  className,
  value,
  size,
  clickable,
}: {
  className?: string;
  value?: NetworkSecurity[] | null;
  size: 'xs' | 'sm' | 'md';
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
      className={className}
      clickable={clickable}
      size={size}
      title={<CoinSecurityDetails value={value} />}
      value={securityStatus}
    />
  );
}
