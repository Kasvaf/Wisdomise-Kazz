import { clsx } from 'clsx';
import { Link } from 'react-router-dom';
import { type Coin as CoinType } from 'api/types/shared';
import { gtmClass } from 'utils/gtmClass';
import { HoverTooltip } from './HoverTooltip';

export function CoinLogo({
  coin,
  className,
}: {
  coin: CoinType;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-full bg-v1-surface-l6',
        className,
      )}
    >
      <div
        className="absolute inset-0 size-full scale-150 bg-cover bg-center bg-no-repeat blur-md invert"
        style={{
          ...(typeof coin.logo_url === 'string' && {
            backgroundImage: `url("${coin.logo_url}")`,
          }),
        }}
      />
      <div
        className="absolute inset-0 size-full bg-cover bg-center bg-no-repeat"
        style={{
          ...(typeof coin.logo_url === 'string' && {
            backgroundImage: `url("${coin.logo_url}")`,
          }),
        }}
      />
    </div>
  );
}

export function Coin({
  className,
  coin,
  imageClassName,
  nonLink,
  mini,
  truncate = true,
  popup,
}: {
  coin: CoinType;
  className?: string;
  imageClassName?: string;
  nonLink?: boolean;
  mini?: boolean;
  truncate?: boolean | number;
  popup?: boolean;
}) {
  const shouldTruncate =
    truncate === true || (typeof truncate === 'number' && truncate > 0);
  const truncateSize = typeof truncate === 'number' ? truncate : 110;
  const rootClassName = clsx(
    'inline-flex w-auto shrink items-center gap-2 pe-2',
    !mini && 'p-1',
    !nonLink &&
      'group rounded-md transition-all hover:bg-v1-background-hover hover:text-inherit',
    className,
  );
  const content = (
    <>
      <CoinLogo
        coin={coin}
        className={clsx(
          'shrink-0',
          imageClassName ?? (mini ? 'size-4' : 'size-8'),
        )}
      />
      <div
        className={clsx('shrink grow leading-snug')}
        style={{
          maxWidth: shouldTruncate ? `${truncateSize}px` : 'auto',
        }}
      >
        <div
          className={clsx(
            shouldTruncate && 'overflow-hidden text-ellipsis',
            'whitespace-nowrap',
          )}
        >
          {mini ? coin.abbreviation ?? coin.slug : coin.name ?? coin.slug}
        </div>
        {!mini && coin.abbreviation && (
          <>
            {/* eslint-disable-next-line tailwindcss/enforces-shorthand */}
            <div
              className={clsx(
                shouldTruncate && 'overflow-hidden text-ellipsis',
                'whitespace-nowrap text-[90%] opacity-70',
              )}
            >
              {coin.abbreviation ?? ''}
            </div>
          </>
        )}
      </div>
    </>
  );

  return (
    <HoverTooltip
      title={
        <div className="text-sm">
          <div>{coin.name}</div>
          <div className="text-[80%] opacity-70">{coin.abbreviation}</div>
        </div>
      }
      disabled={popup === false}
    >
      {nonLink || !coin.slug ? (
        <span className={rootClassName}>{content}</span>
      ) : (
        <Link
          className={clsx(rootClassName, gtmClass('coin_list-item'))}
          to={{
            pathname: `/coin/${coin.slug}`,
          }}
        >
          {content}
        </Link>
      )}
    </HoverTooltip>
  );
}
