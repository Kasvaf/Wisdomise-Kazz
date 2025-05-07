import { clsx } from 'clsx';
import { type FC } from 'react';
import { type NetworkRadarNCoin } from 'api/insight/network';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ReadableNumber } from 'shared/ReadableNumber';
import { CoinLogo } from 'shared/Coin';
import { ReactComponent as PositiveIcon } from './positive.svg';
import { ReactComponent as NegativeIcon } from './negative.svg';

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
        <div className="flex flex-col gap-px">
          <ReadableNumber
            value={value?.update.liquidity.usd}
            label="$"
            popup="never"
            className="text-xxs"
            format={{
              decimalLength: 1,
            }}
          />
          <DirectionalNumber
            value={value?.update.liquidity_change?.percent}
            popup="never"
            className="text-[82%]"
            showIcon={false}
            showSign
            format={{
              decimalLength: 1,
            }}
            label="%"
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
            <CoinLogo value={value?.quote_symbol} className="size-5" />
          )}
          <ReadableNumber
            value={
              type.startsWith('initial')
                ? value?.initial_liquidity.native
                : value?.update.liquidity.native
            }
            popup="never"
          />
          <span className="contents text-v1-content-secondary">
            /
            <ReadableNumber
              value={
                type.startsWith('initial')
                  ? value?.initial_liquidity.usd
                  : value?.update.liquidity.usd
              }
              label="$"
              popup="never"
            />
          </span>
        </div>
        {type.startsWith('update') && (
          <DirectionalNumber
            value={value?.update.liquidity_change?.percent}
            popup="never"
            showIcon={false}
            showSign
            className={clsx(
              'text-[85%]',
              !type.endsWith('icon') && !type.endsWith('row') && 'ps-5',
            )}
            label="%"
            format={{
              decimalLength: 1,
            }}
          />
        )}
      </div>
    </div>
  );
};
