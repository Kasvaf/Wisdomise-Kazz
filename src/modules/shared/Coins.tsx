import { Tooltip } from 'antd';
import { clsx } from 'clsx';
import { type Coin as CoinType } from 'api/types/shared';
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
      overlayInnerStyle={{
        padding: '0.75rem',
        fontSize: '0.8rem',
        fontFamily: 'monospace',
        width: 'auto',
      }}
      title={
        <div className="flex flex-col gap-2 text-sm">
          {coins.map(coin => (
            <Coin truncate key={JSON.stringify(coin)} coin={coin} />
          ))}
        </div>
      }
      overlayClassName="pointer-events-none"
    >
      <span
        className={clsx(
          'inline-flex w-auto shrink cursor-help items-center justify-start -space-x-1',
          className,
        )}
      >
        {coins.slice(0, 3).map(coin => (
          <div
            key={JSON.stringify(coin)}
            className={clsx(
              'inline-flex rounded-full border border-v1-surface-l3 bg-white bg-cover bg-center bg-no-repeat',
              imageClassName ?? 'size-4',
            )}
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
