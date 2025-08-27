import type { CoinNetwork } from 'api/discovery';
import type { Coin } from 'api/types/shared';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { CoinCategoryLabel } from './CoinCategoryLabel';
import { CoinLabel } from './CoinLabel';
import { CoinNetworksLabel } from './CoinNetworksLabel';
import { icons } from './icons';

export function CoinLabels({
  className,
  categories,
  networks,
  labels: _labels,
  prefix,
  suffix,
  size = 'sm',
  clickable = true,
  truncate = false,
}: {
  className?: string;
  categories?: Coin['categories'] | null;
  networks?: CoinNetwork[] | null;
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
      {labels.map(label => (
        <CoinLabel
          clickable={clickable}
          key={label}
          size={size}
          value={label}
        />
      ))}
      {!truncate && (
        <CoinCategoryLabel
          clickable={clickable}
          size={size}
          value={categories}
        />
      )}
      {!truncate && (
        <CoinNetworksLabel clickable={clickable} size={size} value={networks} />
      )}
      {suffix}
    </div>
  );
}
