import { Tooltip } from 'antd';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';
import { type Coin as CoinType } from 'api/types/shared';

const MAX_LENGTH = 18;

const truncate = (str: string) =>
  str.length > MAX_LENGTH ? str.slice(0, MAX_LENGTH - 3) + '...' : str;

export function Coin({
  className,
  coin,
  imageClassName,
  nonLink,
  mini,
}: {
  coin: CoinType;
  className?: string;
  imageClassName?: string;
  nonLink?: boolean;
  mini?: boolean;
}) {
  const rootClassName = clsx(
    'inline-flex items-center gap-2',
    !mini && 'p-1 pe-2',
    !nonLink &&
      'group rounded-md transition-all hover:bg-v1-background-hover hover:text-inherit',
    className,
  );
  const content = (
    <>
      <div
        className={clsx(
          'shrink-0 rounded-full bg-cover bg-center bg-no-repeat',
          imageClassName ?? (mini ? 'size-4' : 'size-8'),
        )}
        style={{
          ...(typeof coin.logo_url === 'string' && {
            backgroundImage: `url("${coin.logo_url}")`,
          }),
        }}
      />
      <div className="w-full whitespace-nowrap leading-snug">
        <div>{mini ? truncate(coin.abbreviation) : truncate(coin.name)}</div>
        {!mini && (
          <div className="text-[80%] opacity-70">
            {truncate(coin.abbreviation)}
          </div>
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
          className={rootClassName}
          to={{
            pathname: `/insight/coin-radar/${coin.slug}`,
          }}
        >
          {content}
        </Link>
      )}
    </Tooltip>
  );
}
