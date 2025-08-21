import { Tooltip } from 'antd';
import type { Coin as CoinType } from 'api/types/shared';
import { clsx } from 'clsx';
import { Coin } from './Coin';

export function Coins({
  className,
  coins,
  imageClassName,
}: {
  coins: CoinType[];
  className?: string;
  imageClassName?: string;
  nonLink?: boolean;
  mini?: boolean;
  truncate?: boolean;
}) {
  return (
    <Tooltip
      color="#151619"
      overlayClassName="pointer-events-none"
      overlayInnerStyle={{
        padding: '0.75rem',
        fontSize: '0.8rem',
        fontFamily: 'monospace',
        width: 'auto',
      }}
      title={
        <div className="grid grid-cols-3 gap-2">
          {coins.map(coin => (
            <Coin
              className="text-xs"
              coin={coin}
              key={JSON.stringify(coin)}
              mini
              truncate
            />
          ))}
        </div>
      }
    >
      <span
        className={clsx(
          '-space-x-1 inline-flex w-auto shrink cursor-help items-center justify-start',
          className,
        )}
      >
        {coins.slice(0, 3).map(coin => (
          <div
            className={clsx(
              'inline-flex rounded-full border border-v1-surface-l3 bg-black bg-center bg-cover bg-no-repeat',
              imageClassName ?? 'size-4',
            )}
            key={JSON.stringify(coin)}
            style={{
              ...(typeof coin.logo_url === 'string' && {
                backgroundImage: `url("${coin.logo_url}")`,
              }),
            }}
          />
        ))}
        {coins.length > 3 && (
          <div
            className={clsx(
              'inline-flex items-center justify-center overflow-hidden rounded-full border border-v1-surface-l3 bg-v1-surface-l4 text-[8px] text-v1-content-primary',
              imageClassName ?? 'size-4',
            )}
          >
            +{coins.length - 3}
          </div>
        )}
      </span>
    </Tooltip>
  );
}
