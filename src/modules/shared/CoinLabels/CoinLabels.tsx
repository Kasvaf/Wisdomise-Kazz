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
  mini = false,
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
}) {
  const labels = (_labels ?? [])
    .filter((x, i, self) => {
      if (!truncate) return true;
      const icon = icons[x as never];
      if (!icon || self.findIndex(y => icons[y as never] === icon) !== i)
        return false;
      return true;
    })
    .filter((_, i) => (truncate ? i < 2 : true));

  return (
    <div
      className={clsx(
        'flex items-start justify-start gap-[2px]',
        mini ? 'flex-nowrap overflow-hidden text-xxs' : 'flex-wrap',
        className,
      )}
    >
      {prefix}
      <CoinSecurityLabel
        coin={coin}
        value={security}
        mini={mini}
        clickable={clickable}
      />
      {labels.map(label => (
        <CoinLabel key={label} value={label} mini={mini} popup={clickable} />
      ))}
      {!truncate && (
        <CoinCategoryLabel
          value={categories}
          mini={mini}
          clickable={clickable}
        />
      )}
      {!truncate && (
        <CoinNetworksLabel value={networks} mini={mini} clickable={clickable} />
      )}
      {suffix}
    </div>
  );
}
