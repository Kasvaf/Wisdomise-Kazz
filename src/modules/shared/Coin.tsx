import { useNetworks } from 'api/discovery';
import { useSymbolInfo } from 'api/symbol';
import type { Coin as CoinType } from 'api/types/shared';
import { clsx } from 'clsx';
import { useDiscoveryRouteMeta } from 'modules/discovery/useDiscoveryRouteMeta';
import { type ReactNode, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { gtmClass } from 'utils/gtmClass';
import useIsMobile from 'utils/useIsMobile';
import NetworkIcon from './NetworkIcon';

export function CoinLogo({
  value,
  className,
  noCors,
  network,
}: {
  value?: CoinType | string | null;
  className?: string;
  noCors?: boolean;
  network?: string;
}) {
  const url = typeof value === 'string' ? value : value?.logo_url;

  const networks = useNetworks({
    query: network,
  });

  const networkObj = useMemo(
    () => networks.data?.find(x => x.slug === network),
    [networks.data, network],
  );

  return (
    <div className={clsx('relative inline-block overflow-hidden', className)}>
      <div
        className="size-full overflow-hidden rounded-full bg-black bg-center bg-cover bg-no-repeat"
        style={{
          ...(url && {
            backgroundImage: `url("${
              noCors ? `https://corsproxy.io/?url=${url}` : url
            }")`,
          }),
        }}
      />

      {networkObj?.icon_url && (
        <img
          alt={network}
          className="absolute right-0 bottom-0 size-[40%] rounded-full"
          src={networkObj?.icon_url}
        />
      )}
    </div>
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
    popup === false
      ? ''
      : (coin.name ?? coin.abbreviation ?? coin.slug ?? '---');
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
  const { getUrl } = useDiscoveryRouteMeta();

  useSymbolInfo('the-open-network');
  const content = (
    <>
      <CoinLogo
        className={clsx(
          'shrink-0',
          imageClassName ?? (mini ? 'size-4' : 'size-8'),
        )}
        noCors={noCors}
        value={coin}
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
                  ? (coin.abbreviation ?? coin.slug ?? '---')
                  : (coin.name ?? coin.slug ?? '---')}
              </div>
              {networks && (
                <div className="flex items-center">
                  {networks.map(n => (
                    <NetworkIcon className="ml-1" key={n} network={n} />
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
          title={tooltip}
          to={getUrl({
            detail: 'coin',
            slug: coin.slug,
            view: 'both',
          })}
        >
          {content}
        </Link>
      )}
    </>
  );
}
