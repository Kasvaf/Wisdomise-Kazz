import { clsx } from 'clsx';
import { Link, useLocation } from 'react-router-dom';
import { useMemo, type ReactNode } from 'react';
import { useSymbolInfo } from 'api/symbol';
import { type Coin as CoinType } from 'api/types/shared';
import { gtmClass } from 'utils/gtmClass';
import useIsMobile from 'utils/useIsMobile';
import useMenuItems from 'modules/base/Layout/MenuItems/useMenuItems';
import NetworkIcon from './NetworkIcon';

export function CoinLogo({
  coin,
  className,
  noCors,
}: {
  coin: CoinType;
  className?: string;
  noCors?: boolean;
}) {
  return (
    <div
      className={clsx(
        'relative inline-block overflow-hidden rounded-full bg-white bg-cover bg-center bg-no-repeat',
        className,
      )}
      style={{
        ...(typeof coin.logo_url === 'string' && {
          backgroundImage: `url("${
            noCors
              ? `https://corsproxy.io/?url=${coin.logo_url}`
              : coin.logo_url
          }")`,
        }),
      }}
    />
  );
}

export function Coin({
  coin,
  networks,
  className,
  imageClassName,
  nonLink,
  mini,
  truncate = true,
  popup,
  noText,
  abbrevationSuffix,
  noCors,
}: {
  coin: CoinType;
  networks?: string[];
  className?: string;
  imageClassName?: string;
  nonLink?: boolean;
  mini?: boolean;
  truncate?: boolean | number;
  popup?: boolean;
  noText?: boolean;
  abbrevationSuffix?: ReactNode;
  noCors?: boolean;
}) {
  const isMobile = useIsMobile();
  const shouldTruncate =
    truncate === true || (typeof truncate === 'number' && truncate > 0);
  const tooltip =
    popup === false ? '' : coin.name ?? coin.abbreviation ?? coin.slug ?? '---';
  const renderText = noText !== true;
  const truncateSize =
    typeof truncate === 'number' ? truncate : isMobile ? 70 : 110;
  const rootClassName = clsx(
    'inline-flex w-auto shrink items-center gap-2 pe-2 align-[inherit]',
    !mini && 'p-1 mobile:p-0',
    !nonLink &&
      'group rounded-md transition-all hover:bg-white/5 hover:text-inherit',
    className,
  );

  const { pathname } = useLocation();

  const { items } = useMenuItems();
  const href = useMemo(() => {
    const discoverTab = items.find(tab => pathname.includes(tab.link));
    return `/coin/${coin.slug}${
      discoverTab ? `?discoverTab=${discoverTab.name}` : ''
    }`;
  }, [items, coin.slug, pathname]);

  useSymbolInfo('the-open-network');
  const content = (
    <>
      <CoinLogo
        coin={coin}
        className={clsx(
          'shrink-0',
          imageClassName ?? (mini ? 'size-4' : 'size-8'),
        )}
        noCors={noCors}
      />
      {renderText && (
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
            <div className="flex items-center">
              <div
                className={clsx(
                  truncate && 'overflow-hidden text-ellipsis',
                  'whitespace-nowrap',
                )}
              >
                {mini
                  ? coin.abbreviation ?? coin.slug ?? '---'
                  : coin.name ?? coin.slug ?? '---'}
              </div>
              {networks && (
                <div className="flex items-center">
                  {networks.map(n => (
                    <NetworkIcon key={n} network={n} className="ml-1" />
                  ))}
                </div>
              )}
            </div>
            {!mini && coin.abbreviation && (
              <>
                {/* eslint-disable-next-line tailwindcss/enforces-shorthand */}
                <div
                  className={clsx(
                    'flex items-center whitespace-nowrap text-[80%]',
                    truncate && 'overflow-hidden text-ellipsis',
                  )}
                >
                  <span
                    className={clsx(
                      'opacity-70',
                      abbrevationSuffix && 'max-w-[60%] truncate',
                    )}
                  >
                    {coin.abbreviation ?? ''}
                  </span>
                  {abbrevationSuffix}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      {nonLink || !coin.slug ? (
        <span className={rootClassName} title={tooltip}>
          {content}
        </span>
      ) : (
        <Link
          className={clsx(rootClassName, gtmClass('coin_list-item'))}
          to={href}
          title={tooltip}
        >
          {content}
        </Link>
      )}
    </>
  );
}
