import { Tooltip } from 'antd';
import { clsx } from 'clsx';
import { Link, createSearchParams } from 'react-router-dom';

export const cdnCoinIcon = (name: string) =>
  `https://cdn.jsdelivr.net/gh/vadimmalykhin/binance-icons/crypto/${name}.svg`;

const MAX_LENGTH = 18;

const truncate = (str: string) =>
  str.length > MAX_LENGTH ? str.slice(0, MAX_LENGTH - 3) + '...' : str;

export function Coin({
  className,
  abbrevation,
  fullName,
  image,
  imageClassName,
  nonLink,
}: {
  abbrevation: string;
  fullName?: string | null;
  image?: string | null;
  className?: string;
  imageClassName?: string;
  nonLink?: boolean;
}) {
  const logoUrl = image ?? cdnCoinIcon(abbrevation);
  const rootClassName = clsx(
    'inline-flex items-center gap-2 p-1 pe-3',
    !nonLink &&
      'group rounded-md transition-all hover:bg-white/10 hover:text-white',
    className,
  );
  const content = (
    <>
      <div
        className={clsx(
          'shrink-0 rounded-full bg-white bg-cover bg-center bg-no-repeat',
          imageClassName ?? 'size-8',
        )}
        style={{
          backgroundImage: `url("${logoUrl}")`,
        }}
      />
      <div className="flex w-full flex-col gap-0 whitespace-nowrap">
        {typeof fullName === 'string' && fullName ? (
          <>
            <span>{truncate(fullName)}</span>
            <span className="text-[80%] opacity-70">
              {truncate(abbrevation)}
            </span>
          </>
        ) : (
          <span>{truncate(abbrevation)}</span>
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
          {typeof fullName === 'string' && fullName ? (
            <>
              <div>{fullName}</div>
              <div className="text-[80%] opacity-70">{abbrevation}</div>
            </>
          ) : (
            <div>{abbrevation}</div>
          )}
        </div>
      }
      overlayClassName="pointer-events-none"
    >
      {nonLink ? (
        <span className={rootClassName}>{content}</span>
      ) : (
        <Link
          className={rootClassName}
          to={{
            pathname: `/insight/coin-radar/${abbrevation}`,
            search: createSearchParams({
              ...(fullName && {
                name: fullName,
              }),
            }).toString(),
          }}
        >
          {content}
        </Link>
      )}
    </Tooltip>
  );
}
