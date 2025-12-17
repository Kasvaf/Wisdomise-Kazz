import { bxHide, bxShow, bxsCopy } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import { calcValueByThreshold } from 'modules/discovery/ListView/NetworkRadar/lib';
import { ReactComponent as UnBlackListDevIcon } from 'modules/discovery/ListView/NetworkRadar/NCoinTokenInsight/dev_holding.svg';
import { type FC, type ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  WRAPPED_SOLANA_CONTRACT_ADDRESS,
  WRAPPED_SOLANA_SLUG,
} from 'services/chains/constants';
import type { SymbolSocailAddresses } from 'services/grpc/proto/network_radar';
import type { CoinCommunityData, CoinNetwork } from 'services/rest/discovery';
import { slugToTokenAddress, useTokenInfo } from 'services/rest/token-info';
import type { Coin as CoinType } from 'services/rest/types/shared';
import { useHideToken } from 'shared/BlacklistManager/useHideToken';
import { TokenLabels, TokenNetworksLabel } from 'shared/CoinLabels';
import { HoverTooltip } from 'shared/HoverTooltip';
import Icon from 'shared/Icon';
import { TokenSocials } from 'shared/TokenSocials';
import { useGlobalNetwork } from 'shared/useGlobalNetwork';
import { useShare } from 'shared/useShare';
import { Button, type ButtonSize } from 'shared/v1-components/Button';
import { shortenAddress } from 'utils/address';
import { openInNewTab } from 'utils/click';
import { base64UrlDecode } from 'utils/encode';
import { formatNumber } from 'utils/numbers';
import { isProduction } from 'utils/version';
import { ReactComponent as BlackListDevIcon } from './blacklist_dev.svg';
import { ReactComponent as LensIcon } from './lens.svg';

type TokenSize = 'xs' | 'sm' | 'md' | 'lg';

export const Token: FC<{
  name?: string | null;
  abbreviation?: string | null;

  header?: ReactNode;
  subtitle?: ReactNode;

  slug?: string | null;
  address?: string | null;
  devAddress?: string | null;

  logo?: string | null;
  noCors?: boolean;
  marker?: string;
  progress?: number;

  /* Labels */
  categories?: CoinType['categories'] | null;
  networks?: CoinNetwork[] | null;
  labels?: string[] | null;
  socials?: CoinCommunityData['links'] | SymbolSocailAddresses | null;
  icon?: boolean;

  className?: string;
  block?: boolean;
  onClick?: () => void;
  link?: boolean;
  showAddress?: boolean;
  truncate?: boolean;
  extra?: ReactNode;
  size?: TokenSize;
  popup?: boolean;
  autoFill?: boolean;
  enableBlacklist?: boolean;
}> = ({
  slug,
  address,
  name,
  abbreviation,
  devAddress,
  header,
  subtitle,
  logo,
  noCors,

  marker,
  progress,
  showAddress = true,

  categories,
  networks,
  labels,
  socials,

  className,
  block,
  onClick,
  enableBlacklist,

  truncate = true,
  extra,
  size = 'md',
  link = true,
  autoFill = false,
  icon = false,
  popup = false,
}) => {
  const { data: tokenInfo } = useTokenInfo({
    slug: slug ?? undefined,
    tokenAddress: address ?? undefined,
    enabled: autoFill,
  });
  const [globalNetwork] = useGlobalNetwork();
  const [copy, copyNotif] = useShare('copy');

  const RootComponent = link ? TokenLink : 'div';

  return (
    <HoverTooltip
      disabled={!address || !popup}
      title={
        <Button
          onClick={() => {
            if (address) {
              void copy(address);
            }
          }}
          size="2xs"
          variant="ghost"
        >
          <span>{shortenAddress(address, 12, 4)}</span>
          <Icon
            className="[&_svg]:!size-3 cursor-copy opacity-75"
            name={bxsCopy}
            size={6}
          />
        </Button>
      }
    >
      <RootComponent
        address={address}
        className={clsx(
          block ? 'flex' : 'inline-flex',
          'relative items-center justify-start gap-3 leading-normal',
          className,
        )}
        onClick={onClick}
        slug={slug}
      >
        <div
          className={clsx(
            'relative flex shrink-0 flex-col items-center justify-center gap-1',
            size === 'sm' && 'w-8',
            size === 'md' && 'w-11',
            size === 'lg' && 'w-20',
          )}
        >
          <div
            className={clsx(
              'group/image shrink-0',
              size === 'md'
                ? 'size-11'
                : size === 'sm'
                  ? 'size-6'
                  : size === 'xs'
                    ? 'size-4'
                    : 'size-20',
            )}
            title={
              typeof progress === 'number'
                ? `Bounding Curve: ${formatNumber(progress * 100, {
                    compactInteger: true,
                    decimalLength: 2,
                    minifyDecimalRepeats: true,
                    separateByComma: true,
                  })}%`
                : undefined
            }
          >
            <TokenImage
              name={abbreviation || (autoFill ? tokenInfo?.symbol : undefined)}
              noCors={noCors}
              size={size}
              src={logo || (autoFill ? tokenInfo?.image_uri : undefined)}
            />
            {typeof progress === 'number' && (
              <TokenProgress progress={progress} />
            )}
            {marker && (
              <div
                className={clsx(
                  'absolute inline-flex items-center justify-center overflow-hidden rounded-sm border border-white/10 bg-v1-surface-l0',
                  size === 'md'
                    ? 'right-[-4px] bottom-[-4px] size-4'
                    : 'right-[-4px] bottom-[-4px] size-5',
                )}
              >
                <img alt="" className="size-[80%] object-cover" src={marker} />
              </div>
            )}
            {enableBlacklist && (
              <div
                className={clsx(
                  'group-hover/image:!inline-flex !hidden',
                  '-top-1 -left-1 absolute z-10 flex flex-col gap-1',
                )}
              >
                <BtnHideToken
                  address={address}
                  className={
                    size === 'lg' ? '[&_svg]:!size-4' : '[&_svg]:!size-3'
                  }
                  size={size === 'lg' ? '2xs' : '3xs'}
                />
                {devAddress && (
                  <BtnBlacklistDev
                    className={
                      size === 'lg' ? '[&_svg]:!size-4' : '[&_svg]:!size-3'
                    }
                    devAddress={devAddress}
                    size={size === 'lg' ? '2xs' : '3xs'}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {!icon && (
          <div
            className={clsx(
              'relative flex grow flex-col justify-between gap-1 overflow-hidden whitespace-nowrap',
              truncate && 'max-w-64',
            )}
          >
            <div className="flex items-center gap-2">
              {(abbreviation || (autoFill && tokenInfo?.symbol)) && (
                <p
                  className={clsx(
                    'font-medium',
                    size === 'md'
                      ? 'text-sm'
                      : size === 'sm'
                        ? 'text-xs'
                        : 'text-base',
                    truncate
                      ? [size === 'md' ? 'max-w-32' : 'max-w-20']
                      : 'max-w-36',
                    'overflow-hidden truncate',
                  )}
                  title={abbreviation ?? ''}
                >
                  {abbreviation ?? (autoFill ? tokenInfo?.symbol : undefined)}
                </p>
              )}
              {labels && (
                <TokenLabels
                  categories={categories}
                  labels={[...(labels ?? [])].filter(x => !!x)}
                  size="xs"
                  truncate={truncate}
                />
              )}
              <TokenSocials
                abbreviation={abbreviation}
                contractAddress={
                  networks?.filter(x => x.network.slug === globalNetwork)?.[0]
                    ?.contract_address
                }
                hideSearch={!abbreviation || truncate}
                name={name}
                size="xs"
                value={socials}
              />
              {header}
            </div>
            <div className="flex items-center gap-2">
              {subtitle
                ? subtitle
                : (name || (autoFill && tokenInfo?.name)) && (
                    <p
                      className={clsx(
                        'font-light text-white/70',
                        size === 'md' ? 'text-xs' : 'text-sm',
                        truncate
                          ? [size === 'md' ? 'max-w-16' : 'max-w-12']
                          : 'max-w-36',
                        'overflow-hidden truncate',
                      )}
                      title={name || tokenInfo?.name}
                    >
                      {name ?? (autoFill ? tokenInfo?.name : undefined)}
                    </p>
                  )}
              {(address || slug) && showAddress && (
                <div
                  className={clsx(
                    'flex cursor-copy items-center gap-1 font-mono text-v1-content-primary/50 hover:text-v1-content-primary/70',
                    size === 'md' ? 'text-xs' : 'text-sm',
                  )}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    void copy(address ?? slugToTokenAddress(slug) ?? '');
                  }}
                >
                  {shortenAddress(address ?? slugToTokenAddress(slug))}
                  <Icon name={bxsCopy} size={12} />
                </div>
              )}
              {(networks?.length ?? 0) > 1 && (
                <TokenNetworksLabel clickable size="xs" value={networks} />
              )}
            </div>
            {extra && (
              <div className="flex items-center gap-1 text-2xs">{extra}</div>
            )}
          </div>
        )}
      </RootComponent>
      {copyNotif}
    </HoverTooltip>
  );
};

export const TokenLink = ({
  slug,
  address,
  children,
  className,
}: {
  slug?: string | null;
  address?: string | null;
  children?: ReactNode;
  className?: string;
}) => {
  const isSolana =
    slug === WRAPPED_SOLANA_SLUG || address === WRAPPED_SOLANA_CONTRACT_ADDRESS;
  const to = isSolana
    ? '#'
    : `/token/solana/${slug ? slugToTokenAddress(slug) : address}`;

  return (
    <Link
      className={className}
      onContextMenu={e => !isSolana && openInNewTab(e)}
      to={to}
    >
      {children}
    </Link>
  );
};

const TokenProgress = ({ progress }: { progress: number }) => {
  return (
    <svg
      className="pointer-events-none absolute inset-0 rounded-md"
      height="100%"
      style={{ ['--value' as never]: progress * 100 }}
      viewBox="0 0 40 40"
      width="100%"
    >
      {/* Background track */}
      <rect
        fill="none"
        height="38"
        rx="3"
        ry="3"
        stroke="rgba(0,0,0,0.3)"
        strokeWidth={2}
        width="38"
        x="1"
        y="1"
      />

      {/* Progress stroke */}
      <rect
        className="transition-[stroke-dashoffset]"
        fill="none"
        height="38"
        rx="3"
        ry="3"
        stroke={calcValueByThreshold({
          value: progress,
          rules: [
            { limit: 0.33, result: '#FFF' },
            { limit: 0.66, result: '#00A3FF' },
            { limit: 0.99, result: '#00FFA3' },
          ],
          fallback: '#FFDA6C',
        })}
        strokeDasharray={152}
        strokeDashoffset={152 - progress * 100 * 1.52}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        width="38"
        x="1"
        y="1"
      />
    </svg>
  );
};

export const TokenImage = ({
  src,
  name,
  size,
  noCors,
}: {
  src?: string | null;
  name?: string | null;
  size?: TokenSize;
  noCors?: boolean;
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const [fallbackFailed, setFallbackFailed] = useState(false);

  const fallbackSrcBase64 = src?.split('/').pop();
  const fallbackSrc =
    fallbackSrcBase64 && !isFallback && src?.includes('cdn-trench')
      ? base64UrlDecode(fallbackSrcBase64)
      : '';

  const setFallback = () => {
    if (isFallback || !src?.includes('cdn-trench') || !isProduction) {
      setFallbackFailed(true);
      return;
    }

    if (fallbackSrcBase64) {
      setImgSrc(fallbackSrc);
      setIsFallback(true);
    }
  };

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <HoverTooltip
      disabled={size === 'xs'}
      placement="bottomLeft"
      title={
        (fallbackSrc || src) && (
          <a
            className="group/full-image flex items-center justify-center"
            href={`https://lens.google.com/uploadbyurl?url=${fallbackSrc || src}`}
            onClick={e => e.stopPropagation()}
            target="_blank"
          >
            <LensIcon className="group-hover/full-image:!opacity-100 absolute size-10 opacity-0" />
            <img
              alt={name ?? ''}
              className="h-auto min-h-20 w-52 rounded-md group-hover/full-image:opacity-40"
              src={fallbackSrc || src || undefined}
            />
          </a>
        )
      }
    >
      <div
        className={clsx(
          'relative flex aspect-square h-full items-center justify-center overflow-hidden rounded-lg border border-white/5 bg-v1-surface-l0 text-3xl text-white/70',
          size === 'sm' && '!text-base !rounded-md',
          size === 'xs' && '!rounded-sm text-2xs',
        )}
      >
        {!isLoaded && (
          <span className="absolute">
            {name?.split('').shift()?.toUpperCase()}
          </span>
        )}
        {imgSrc && !fallbackFailed && (
          <img
            alt={name ?? ''}
            className="relative size-full object-cover"
            loading="lazy"
            onError={setFallback}
            onLoad={() => setIsLoaded(true)}
            src={noCors ? `https://corsproxy.io/?url=${imgSrc}` : imgSrc}
          />
        )}
      </div>
    </HoverTooltip>
  );
};

const BtnHideToken = ({
  address,
  size,
  className,
}: {
  address?: string | null;
  size?: ButtonSize;
  className?: string;
}) => {
  const { addBlacklist } = useUserSettings();
  const { isHiddenByCA } = useHideToken({ address, network: 'solana' });

  return (
    <HoverTooltip title={isHiddenByCA ? 'Show Token' : 'Hide Token'}>
      <Button
        className={className}
        fab
        onClick={e => {
          if (address) {
            addBlacklist(
              { type: 'ca', network: 'solana', value: address },
              true,
            );
          }
          e.stopPropagation();
          e.preventDefault();
        }}
        size={size}
        variant="outline"
      >
        <Icon name={isHiddenByCA ? bxShow : bxHide} />
      </Button>
    </HoverTooltip>
  );
};

const BtnBlacklistDev = ({
  devAddress,
  size,
  className,
}: {
  size?: ButtonSize;
  className?: string;
  devAddress?: string | null;
}) => {
  const { addBlacklist } = useUserSettings();
  const { isHiddenByDev } = useHideToken({ network: 'solana', devAddress });

  return (
    <HoverTooltip title={isHiddenByDev ? 'Unblacklist Dev' : 'Blacklist Dev'}>
      <Button
        className={className}
        fab
        onClick={e => {
          if (devAddress) {
            addBlacklist(
              { type: 'dev', network: 'solana', value: devAddress },
              true,
            );
          }
          e.stopPropagation();
          e.preventDefault();
        }}
        size={size}
        variant="outline"
      >
        {isHiddenByDev ? <UnBlackListDevIcon /> : <BlackListDevIcon />}
      </Button>
    </HoverTooltip>
  );
};
