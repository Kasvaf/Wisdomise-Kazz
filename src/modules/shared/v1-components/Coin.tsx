import { type ReactNode, useMemo, type FC } from 'react';
import { clsx } from 'clsx';
import { bxsCopy } from 'boxicons-quasar';
import { Link } from 'react-router-dom';
import { type CoinNetwork, type NetworkSecurity } from 'api/discovery';
import { type Coin as CoinType } from 'api/types/shared';
import { CircularProgress } from 'shared/CircularProgress';
import { CoinLabels } from 'shared/CoinLabels';
import { useGlobalNetwork } from 'shared/useGlobalNetwork';
import { shortenAddress } from 'utils/shortenAddress';
import { useShare } from 'shared/useShare';
import Icon from 'shared/Icon';
import { useDiscoveryRouteMeta } from 'modules/discovery/useDiscoveryRouteMeta';

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

  /* Labels */
  categories?: CoinType['categories'] | null;
  networks?: CoinNetwork[] | null;
  security?: NetworkSecurity[] | null;
  labels?: string[] | null;
  customLabels?: ReactNode;

  /* Common */
  className?: string;
  block?: boolean;
  onClick?: () => void;
  href?: string | boolean;

  extra?: ReactNode | ReactNode[];
  truncate?: boolean;
}> = ({
  slug,
  abbreviation,
  name,
  logo,

  marker,
  progress,

  categories,
  networks,
  security,
  labels,
  customLabels,

  className,
  block,
  href = true,
  onClick,

  extra,
  truncate = true,
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
  const { getUrl } = useDiscoveryRouteMeta();

  return (
    <RootComponent
      className={clsx(
        block ? 'flex' : 'inline-flex',
        'items-center justify-start gap-2 leading-normal',
        className,
      )}
      onClick={onClick}
      to={
        typeof href === 'string'
          ? href
          : href && slug
          ? getUrl({
              detail: 'coin',
              slug,
              view: 'both',
            })
          : '#'
      }
    >
      <div className="relative size-11 shrink-0 rounded-full bg-v1-surface-l0">
        {logo && (
          <img
            src={logo}
            className="absolute inset-0 size-full overflow-hidden rounded-full bg-v1-surface-l0 object-cover"
          />
        )}
        {typeof progress === 'number' && (
          <CircularProgress
            className="absolute inset-0"
            color={
              progress <= 0.33
                ? '#FFF'
                : progress <= 0.66
                ? '#00A3FF'
                : progress <= 0.99
                ? '#00FFA3'
                : '#FFDA6C'
            }
            size={44}
            strokeWidth={3}
            value={progress}
          />
        )}
        {(marker || contractAddress?.network?.logo) && (
          <div className="absolute bottom-[-1px] right-[-1px] inline-flex size-[14px] items-center justify-center overflow-hidden rounded-full bg-v1-surface-l0">
            <img
              src={marker || contractAddress?.network?.logo}
              className="size-full object-cover"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between gap-1 whitespace-nowrap">
        <div className="flex items-center gap-1">
          {abbreviation && (
            <p
              className={clsx(
                'text-sm font-bold',
                truncate && 'max-w-20 overflow-hidden truncate',
              )}
              title={abbreviation}
            >
              {abbreviation}
            </p>
          )}
          <CoinLabels
            labels={[...(labels ?? [])].filter(x => !!x)}
            security={security ?? []}
            categories={categories}
            size="xs"
          />
          {customLabels}
        </div>
        <div className="flex items-center gap-1">
          {name && (
            <p
              className={clsx(
                'text-xs font-light',
                truncate && 'max-w-16 overflow-hidden truncate',
              )}
              title={name}
            >
              {name}
            </p>
          )}
          {contractAddress && !!contractAddress.value && (
            <div className="flex items-center gap-1 font-mono text-xs text-v1-content-secondary">
              {contractAddress.label}
              {contractAddress.value && (
                <button
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    void copy(contractAddress.value ?? '');
                  }}
                  className="cursor-copy"
                >
                  <Icon name={bxsCopy} size={12} />
                  {copyNotif}
                </button>
              )}
            </div>
          )}
          {(networks?.length || 0) > 1 && (
            <CoinLabels networks={networks} size="xs" />
          )}
        </div>
        {extra && (
          <>
            {(Array.isArray(extra) ? extra : [extra])
              .filter(row => !!row)
              .map((row, index) => (
                <div key={index} className="flex items-center gap-1 text-xxs">
                  {row}
                </div>
              ))}
          </>
        )}
      </div>
    </RootComponent>
  );
};
