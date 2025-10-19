import type { CoinCommunityData, CoinNetwork } from 'api/discovery';
import type { SymbolSocailAddresses } from 'api/proto/network_radar';
import type { Coin as CoinType } from 'api/types/shared';
import { bxsCopy } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { calcColorByThreshold } from 'modules/discovery/ListView/NetworkRadar/lib';
import { type FC, type ReactNode, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CoinLabels, CoinNetworksLabel } from 'shared/CoinLabels';
import { CoinSocials } from 'shared/CoinSocials';
import Icon from 'shared/Icon';
import { useGlobalNetwork } from 'shared/useGlobalNetwork';
import { useShare } from 'shared/useShare';
import { openInNewTab } from 'utils/click';
import { base64UrlDecode } from 'utils/encode';
import { formatNumber } from 'utils/numbers';
import { shortenAddress } from 'utils/shortenAddress';
import { isProduction } from 'utils/version';

interface ContractAddressRow {
  value?: string;
  label: string;
  network?: {
    logo: string;
    name: string;
    slug: string;
  };
}

export const Coin: FC<{
  /* Coin object */
  name?: string | null;
  abbreviation?: string | null;
  slug?: string | null;
  logo?: string | null;

  /* Custom Props */
  marker?: string;
  progress?: number;
  progressTitle?: string;

  /* Labels */
  categories?: CoinType['categories'] | null;
  networks?: CoinNetwork[] | null;
  labels?: string[] | null;
  socials?: CoinCommunityData['links'] | SymbolSocailAddresses | null;

  /* Common */
  className?: string;
  block?: boolean;
  onClick?: () => void;
  href?: string | boolean;

  truncate?: boolean;

  customLabels?: ReactNode;
  extra?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}> = ({
  slug,
  abbreviation,
  name,
  logo,

  marker,
  progress,
  progressTitle,

  categories,
  networks,
  labels,
  socials,

  className,
  block,
  href = true,
  onClick,

  truncate = true,
  customLabels,
  extra,
  size = 'md',
}) => {
  const [globalNetwork] = useGlobalNetwork();
  const [copy, copyNotif] = useShare('copy');

  const contractAddress = useMemo<ContractAddressRow | null>(() => {
    const nativeCoin: ContractAddressRow = {
      label: 'Native Coin',
    };
    const multipleChain: ContractAddressRow = {
      label: 'Multi Chain',
    };

    if (!networks || networks.length === 0) return null;

    const matchedNetwork = networks.find(x => x.network.slug === globalNetwork);

    if (matchedNetwork) {
      if (
        matchedNetwork?.symbol_network_type === 'COIN' ||
        !matchedNetwork.contract_address
      ) {
        return {
          ...nativeCoin,
          network: {
            logo: matchedNetwork.network.icon_url,
            name: matchedNetwork.network.name,
            slug: matchedNetwork.network.slug,
          },
        };
      }
      return {
        label: shortenAddress(matchedNetwork.contract_address),
        value: matchedNetwork.contract_address,
        network: {
          logo: matchedNetwork.network.icon_url,
          name: matchedNetwork.network.name,
          slug: matchedNetwork.network.slug,
        },
      };
    } else if (networks.length === 1) {
      if (
        networks[0]?.symbol_network_type === 'COIN' ||
        !networks[0].contract_address
      ) {
        return {
          ...nativeCoin,
          network: {
            logo: networks[0].network.icon_url,
            name: networks[0].network.name,
            slug: networks[0].network.slug,
          },
        };
      }
      return {
        label: shortenAddress(networks[0].contract_address),
        value: networks[0].contract_address,
        network: {
          logo: networks[0].network.icon_url,
          name: networks[0].network.name,
          slug: networks[0].network.slug,
        },
      };
    }

    return multipleChain;
  }, [globalNetwork, networks]);

  const RootComponent = href ? Link : 'div';

  return (
    <RootComponent
      className={clsx(
        block ? 'flex' : 'inline-flex',
        'relative items-center justify-start gap-2 leading-normal',
        className,
      )}
      onClick={onClick}
      onContextMenu={e => href && openInNewTab(e)}
      to={
        typeof href === 'string'
          ? href
          : !href
            ? '#'
            : contractAddress
              ? `/token/${contractAddress.network?.slug ?? globalNetwork}${contractAddress.value ? `/${contractAddress.value}` : ''}`
              : slug
                ? `/token/${slug}`
                : '#'
      }
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
            'relative shrink-0',
            size === 'md' ? 'size-11' : size === 'sm' ? 'size-6' : 'size-20',
          )}
          title={
            typeof progress === 'number'
              ? `${progressTitle ?? ''}${formatNumber(progress * 100, {
                  compactInteger: true,
                  decimalLength: 2,
                  minifyDecimalRepeats: true,
                  separateByComma: true,
                })}%`
              : undefined
          }
        >
          <CoinImage name={abbreviation} size={size} src={logo} />
          {typeof progress === 'number' && <Progress progress={progress} />}
          {(marker || contractAddress?.network?.logo) && (
            <div
              className={clsx(
                'absolute inline-flex items-center justify-center overflow-hidden rounded-md border bg-v1-surface-l0 backdrop-invert',
                size === 'md'
                  ? 'right-[-1px] bottom-[-1px] size-4'
                  : 'right-[-4px] bottom-[0px] size-5',
              )}
            >
              <img
                className="size-full object-cover"
                src={marker || contractAddress?.network?.logo}
              />
            </div>
          )}
        </div>
      </div>

      <div
        className={clsx(
          'relative flex grow flex-col justify-between gap-1 overflow-hidden whitespace-nowrap',
          truncate && 'max-w-64',
        )}
      >
        <div className="flex items-center gap-1">
          {abbreviation && (
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
              title={abbreviation}
            >
              {abbreviation}
            </p>
          )}
          <CoinLabels
            categories={categories}
            labels={[...(labels ?? [])].filter(x => !!x)}
            size="xs"
            truncate={truncate}
          />
          <CoinSocials
            abbreviation={abbreviation}
            contractAddress={
              networks?.filter(x => x.network.slug === globalNetwork)?.[0]
                ?.contract_address
            }
            hideSearch={truncate}
            name={name}
            size="xs"
            value={socials}
          />
          {customLabels}
        </div>
        <div className="flex items-center gap-1">
          {name && (
            <p
              className={clsx(
                'font-light text-white/70',
                size === 'md' ? 'text-xs' : 'text-sm',
                truncate
                  ? [size === 'md' ? 'max-w-16' : 'max-w-12']
                  : 'max-w-36',
                'overflow-hidden truncate',
              )}
              title={name}
            >
              {name}
            </p>
          )}
          {contractAddress && !!contractAddress.value && (
            <div
              className={clsx(
                'flex items-center gap-1 font-mono text-v1-content-secondary',
                size === 'md' ? 'text-xs' : 'text-sm',
              )}
            >
              {contractAddress.label}
              {contractAddress.value && (
                <div
                  className="cursor-copy"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    void copy(contractAddress.value ?? '');
                  }}
                >
                  <Icon name={bxsCopy} size={12} />
                  {copyNotif}
                </div>
              )}
            </div>
          )}
          {(networks?.length ?? 0) > 1 && (
            <CoinNetworksLabel clickable size="xs" value={networks} />
          )}
        </div>
        {extra && (
          <div className="flex items-center gap-1 text-xxs">{extra}</div>
        )}
      </div>
    </RootComponent>
  );
};

const Progress = ({ progress }: { progress: number }) => {
  return (
    <svg
      className="absolute inset-0 rounded-md"
      height="100%"
      style={{ ['--value' as never]: progress * 100 }}
      viewBox="0 0 40 40"
      width="100%"
    >
      {/* Background track */}
      <rect
        fill="none"
        height="38"
        rx="2"
        ry="2"
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
        rx="2"
        ry="2"
        stroke={calcColorByThreshold({
          value: progress,
          rules: [
            { limit: 0.33, color: '#FFF' },
            { limit: 0.66, color: '#00A3FF' },
            { limit: 0.99, color: '#00FFA3' },
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

export const CoinImage = ({
  src,
  name,
  size,
}: {
  src?: string | null;
  name?: string | null;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const [fallbackFailed, setFallbackFailed] = useState(false);

  const setFallback = () => {
    if (isFallback || !src?.includes('cdn-trench') || !isProduction) {
      setFallbackFailed(true);
      return;
    }

    const fallbackSrcBase64 = src?.split('/').pop();
    if (fallbackSrcBase64) {
      const fallbackSrc = base64UrlDecode(fallbackSrcBase64);
      setImgSrc(fallbackSrc);
      setIsFallback(true);
    }
  };

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <div
      className={clsx(
        'relative flex aspect-square h-full items-center justify-center overflow-hidden rounded-md bg-v1-surface-l0 text-3xl text-white/70',
        size === 'sm' && '!text-base',
      )}
    >
      {!isLoaded && (
        <span className="absolute">
          {name?.split('').shift()?.toUpperCase()}
        </span>
      )}
      {imgSrc && !fallbackFailed && (
        <img
          alt=""
          className="relative size-full object-cover"
          loading="lazy"
          onError={setFallback}
          onLoad={() => setIsLoaded(true)}
          src={imgSrc}
        />
      )}
    </div>
  );
};
