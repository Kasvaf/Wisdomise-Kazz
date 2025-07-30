import { bxSearch } from 'boxicons-quasar';
import { useMemo, useState, type ComponentProps, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'usehooks-ts';
import { useNavigate } from 'react-router-dom';
import Icon from 'shared/Icon';
import { useDetailedCoins, useNetworks } from 'api/discovery';
import { Select } from 'shared/v1-components/Select';
import { ReadableNumber } from 'shared/ReadableNumber';
import { useGlobalNetwork } from 'shared/useGlobalNetwork';
import { useDiscoveryRouteMeta } from 'modules/discovery/useDiscoveryRouteMeta';
import { Coin } from 'shared/v1-components/Coin';

export const GlobalSearch: FC<
  Omit<
    ComponentProps<typeof Select>,
    | 'prefixIcon'
    | 'value'
    | 'onChange'
    | 'placeholder'
    | 'options'
    | 'render'
    | 'chevron'
    | 'showSearch'
    | 'loading'
    | 'searchValue'
    | 'onSearch'
    | 'multiple'
  >
> = props => {
  const { t } = useTranslation('common');
  const [network] = useGlobalNetwork();
  const networkName = network
    ?.split('-')
    .map(p => p.toUpperCase().slice(0, 1) + p.toLowerCase().slice(1))
    .join(' ');
  const networks = useNetworks({
    query: network,
  });
  const networkObj = useMemo(
    () => networks.data?.find(x => x.slug === network),
    [networks.data, network],
  );
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query);
  const { getUrl } = useDiscoveryRouteMeta();

  const coins = useDetailedCoins({
    query: debouncedQuery,
  });

  const navigate = useNavigate();

  return (
    <Select
      value={undefined}
      multiple={false}
      onChange={slug => {
        if (slug)
          navigate(
            getUrl({
              detail: 'coin',
              slug,
              view: 'both',
            }),
          );
      }}
      options={coins.data?.map?.(x => x.symbol.slug)}
      dialogClassName="w-[520px] mobile:w-auto"
      render={opt => {
        const row = coins.data?.find?.(x => x.symbol.slug === opt);
        if (!row) return '';
        return (
          <div className="flex items-center justify-between gap-4 px-2 py-3 mobile:px-1">
            <Coin
              abbreviation={row.symbol?.abbreviation}
              name={row.symbol?.name}
              slug={row.symbol?.slug}
              logo={row.symbol?.logo_url}
              categories={row.symbol.categories}
              labels={row.symbol_labels}
              networks={
                row.network_bindings || [
                  {
                    contract_address: row.contract_address || '',
                    symbol_network_type: row.contract_address
                      ? 'TOKEN'
                      : 'COIN',
                    network: networkObj ?? {
                      name: networkName || network || '',
                      slug: network || '',
                      icon_url: '',
                    },
                  },
                ]
              }
              links={row.symbol_community_links}
              security={row.symbol_security ? [row.symbol_security] : null}
              href={false}
            />
            <div className="flex grow items-center justify-end gap-4 justify-self-end whitespace-nowrap text-xs mobile:gap-2 [&_label]:text-v1-content-secondary">
              <p>
                <label>{'MC: '}</label>
                <ReadableNumber
                  value={row.symbol_market_data?.market_cap}
                  label="$"
                  popup="never"
                  format={{ decimalLength: 1 }}
                />
              </p>
              <p>
                <label>{'24h V: '}</label>
                <ReadableNumber
                  value={row.symbol_market_data?.volume_24h}
                  label="$"
                  popup="never"
                  format={{ decimalLength: 1 }}
                />
              </p>
            </div>
          </div>
        );
      }}
      searchPlaceholder={`Search in ${
        networkName ? `${networkName} Network` : 'All Networks'
      }`}
      chevron={false}
      showSearch
      loading={coins.isLoading}
      searchValue={query}
      onSearch={setQuery}
      prefixIcon={
        <Icon name={bxSearch} className="text-v1-content-secondary" />
      }
      placeholder={t('search_coins')}
      {...props}
    />
  );
};
