import type { NetworkRadarNCoin } from 'api/discovery';
import { clsx } from 'clsx';
import type { FC } from 'react';
import { CoinLogo } from 'shared/Coin';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ReadableNumber } from 'shared/ReadableNumber';
import { ReactComponent as NegativeIcon } from './negative.svg';
import { ReactComponent as PositiveIcon } from './positive.svg';

export const NCoinLiquidity: FC<{
  className?: string;
  imgClassName?: string;
  value?: NetworkRadarNCoin | null;
  type:
    | 'initial'
    | 'update'
    | 'update_row'
    | 'initial_row'
    | 'update_with_icon';
}> = ({ className, imgClassName, value, type }) => {
  const isPositive = (value?.update.liquidity_change?.percent ?? 0) > 0;

  if (type === 'update_with_icon') {
    return (
      <div className={clsx('flex items-center justify-start gap-1', className)}>
        {isPositive ? (
          <PositiveIcon className={clsx('shrink-0', imgClassName)} />
        ) : (
          <NegativeIcon className={clsx('shrink-0', imgClassName)} />
        )}
        <div className="flex max-h-max flex-col justify-center">
          <ReadableNumber
            className="text-xxs"
            format={{
              decimalLength: 1,
            }}
            label="$"
            popup="never"
            value={value?.update.liquidity.usd}
          />
          <DirectionalNumber
            className="text-[82%]"
            format={{
              decimalLength: 1,
            }}
            label="%"
            popup="never"
            showIcon={false}
            showSign
            value={value?.update.liquidity_change?.percent}
          />
        </div>
      </div>
    );
  }
  return (
    <div className={clsx('flex items-center justify-start gap-1', className)}>
      <div
        className={clsx(
          'flex gap-1',
          type.endsWith('row') ? 'flex-row items-center' : 'flex-col',
        )}
      >
        <div
          className={clsx(
            type.endsWith('row') ? 'contents' : 'flex items-center gap-1',
          )}
        >
          {value?.quote_symbol && (
            <CoinLogo className="size-5" value={value?.quote_symbol} />
          )}
          <ReadableNumber
            popup="never"
            value={
              type.startsWith('initial')
                ? value?.initial_liquidity.native
                : value?.update.liquidity.native
            }
          />
          <span className="contents text-v1-content-secondary">
            /
            <ReadableNumber
              label="$"
              popup="never"
              value={
                type.startsWith('initial')
                  ? value?.initial_liquidity.usd
                  : value?.update.liquidity.usd
              }
            />
          </span>
        </div>
        {type.startsWith('update') && (
          <DirectionalNumber
            className={clsx(
              'text-[85%]',
              !type.endsWith('icon') && !type.endsWith('row') && 'ps-5',
            )}
            format={{
              decimalLength: 1,
            }}
            label="%"
            popup="never"
            showIcon={false}
            showSign
            value={value?.update.liquidity_change?.percent}
          />
        )}
      </div>
    </div>
  );
};
