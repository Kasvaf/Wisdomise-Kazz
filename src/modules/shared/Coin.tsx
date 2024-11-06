import { Tooltip } from 'antd';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';
import { type Coin as CoinType } from 'api/types/shared';
import { gtmClass } from 'utils/gtmClass';

export function Coin({
  className,
  coin,
  imageClassName,
  nonLink,
  mini,
  truncate = true,
}: {
  coin: CoinType;
  className?: string;
  imageClassName?: string;
  nonLink?: boolean;
  mini?: boolean;
  truncate?: boolean;
}) {
  const rootClassName = clsx(
    'inline-flex w-auto shrink items-center gap-2 pe-2',
    !mini && 'p-1',
    !nonLink &&
      'group rounded-md transition-all hover:bg-v1-background-hover hover:text-inherit',
    className,
  );
  const content = (
    <>
      <div
        className={clsx(
          'relative shrink-0 overflow-hidden rounded-full bg-v1-surface-l6',
          imageClassName ?? (mini ? 'size-4' : 'size-8'),
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
      <div
        className={clsx(
          'shrink grow leading-snug',
          truncate && 'max-w-[110px]',
        )}
      >
        <div
          className={clsx(
            truncate && 'overflow-hidden text-ellipsis',
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
                truncate && 'overflow-hidden text-ellipsis',
                'whitespace-nowrap text-[80%] opacity-70',
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
    <Tooltip
      color="#151619"
      overlayInnerStyle={{
        padding: '0.75rem',
        fontSize: '0.8rem',
        fontFamily: 'monospace',
        width: 'auto',
      }}
      title={
        <div className="text-sm">
          <div>{coin.name}</div>
          <div className="text-[80%] opacity-70">{coin.abbreviation}</div>
        </div>
      }
      overlayClassName="pointer-events-none"
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
    </Tooltip>
  );
}
