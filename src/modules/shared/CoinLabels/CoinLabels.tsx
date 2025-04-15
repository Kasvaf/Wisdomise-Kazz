import { clsx } from 'clsx';
import { type ReactNode } from 'react';
import {
  type CoinNetwork,
  type Coin,
  type NetworkSecurity,
} from 'api/types/shared';
import { CoinLabel } from './CoinLabel';
import { CoinCategoryLabel } from './CoinCategoryLabel';
import { CoinNetworksLabel } from './CoinNetworksLabel';
import { CoinSecurityLabel } from './CoinSecurityLabel';
import { icons } from './icons';

export function CoinLabels({
  className,
  coin,
  categories,
  networks,
  security,
  labels: _labels,
  prefix,
  suffix,
  size = 'sm',
  clickable = true,
  truncate = false,
}: {
  className?: string;
  coin: Coin;
  categories?: Coin['categories'] | null;
  networks?: CoinNetwork[] | null;
  security?: NetworkSecurity[] | null;
  labels?: string[] | null;
  prefix?: ReactNode;
  suffix?: ReactNode;
  mini?: boolean;
  clickable?: boolean;
  truncate?: boolean;
  size?: 'xs' | 'sm' | 'md';
}) {
  const labels = (_labels ?? [])
    .filter((x, i, self) => {
      if (!truncate) return true;
      const icon = icons[x as never];
      if (!icon || self.findIndex(y => icons[y as never] === icon) !== i)
        return false;
      return true;
    })
    .filter((_, i) => (truncate ? i < 2 : true))
    .sort((a, b) => {
      const getWeight = (x: string) => {
        let ret = 0;
        ret += x.includes('uptrend') ? 1 : 0;
        ret += x.includes('bullish') ? 2 : 0;
        ret += x.includes('hype') ? 3 : 0;
        ret += x.includes('social') ? 4 : 0;
        return ret;
      };
      return getWeight(b) - getWeight(a);
    });

  return (
    <div
      className={clsx(
        'flex items-start justify-start gap-[2px]',
        size === 'xs' ? 'flex-nowrap overflow-hidden text-xxs' : 'flex-wrap',
        className,
      )}
    >
      {prefix}
      <CoinSecurityLabel
        coin={coin}
        value={security}
        size={size}
        clickable={clickable}
      />
      {labels.map(label => (
        <CoinLabel key={label} value={label} size={size} popup={clickable} />
      ))}
      {!truncate && (
        <CoinCategoryLabel
          value={categories}
          size={size}
          clickable={clickable}
        />
      )}
      {!truncate && (
        <CoinNetworksLabel value={networks} size={size} clickable={clickable} />
      )}
      {suffix}
    </div>
  );
}
