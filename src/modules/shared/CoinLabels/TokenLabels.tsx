import { clsx } from 'clsx';
import { type FC, memo, type ReactNode } from 'react';
import type { CoinNetwork } from 'services/rest/discovery';
import type { Coin } from 'services/rest/types/shared';
import { CoinCategoryLabel } from './CoinCategoryLabel';
import { CoinLabel } from './CoinLabel';
import { icons } from './icons';
import { TokenNetworksLabel } from './TokenNetworksLabel';

export const TokenLabels: FC<{
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
}> = memo(
  ({
    className,
    categories,
    networks,
    labels: _labels,
    prefix,
    suffix,
    size = 'sm',
    clickable = true,
    truncate = false,
  }) => {
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
          <TokenNetworksLabel
            clickable={clickable}
            size={size}
            value={networks}
          />
        )}
        {suffix}
      </div>
    );
  },
);
