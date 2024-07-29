import { Tooltip } from 'antd';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

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
}: {
  abbrevation: string;
  fullName?: string | null;
  image?: string | null;
  className?: string;
  imageClassName?: string;
}) {
  const logoUrl = image ?? cdnCoinIcon(abbrevation);
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
      <Link
        className={clsx(
          'inline-flex items-center gap-2 p-1 pe-3',
          'group rounded-md transition-all hover:bg-white/10 hover:text-white',
          className,
        )}
        to={`/insight/coin-radar/${abbrevation}`}
      >
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
      </Link>
    </Tooltip>
  );
}
