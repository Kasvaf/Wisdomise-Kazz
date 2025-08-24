import { useDetailedCoins, useNetworks } from 'api/discovery';
import { bxSearch } from 'boxicons-quasar';
import { type ComponentProps, type FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Icon from 'shared/Icon';
import { ReadableNumber } from 'shared/ReadableNumber';
import { useGlobalNetwork } from 'shared/useGlobalNetwork';
import { Coin } from 'shared/v1-components/Coin';
import { Select } from 'shared/v1-components/Select';
import { useDebounce } from 'usehooks-ts';

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

  const coins = useDetailedCoins({
    query: debouncedQuery,
  });

  const navigate = useNavigate();

  return (
    <Select
      chevron={false}
      dialogClassName="w-[520px] mobile:w-auto"
      loading={coins.isLoading}
      multiple={false}
      onChange={ca => {
        if (network) navigate(`/token/${network}${ca ? `/${ca}` : ''}`);
      }}
      onSearch={setQuery}
      options={coins.data?.map?.(x => x.contract_address)}
      placeholder={t('search_coins')}
      prefixIcon={
        <Icon className="text-v1-content-secondary" name={bxSearch} />
      }
      render={opt => {
        const row = coins.data?.find?.(x => x.contract_address === opt);
        if (!row) return '';
        return (
          <div className="flex items-center justify-between gap-4 mobile:px-1 px-2 py-3">
            <Coin
              abbreviation={row.symbol?.abbreviation}
              categories={row.symbol.categories}
              href={false}
              labels={row.symbol_labels}
              links={row.symbol_community_links}
              logo={row.symbol?.logo_url}
              name={row.symbol?.name}
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
              security={row.symbol_security ? [row.symbol_security] : null}
              slug={row.symbol?.slug}
            />
            <div className="flex grow items-center justify-end gap-4 mobile:gap-2 justify-self-end whitespace-nowrap text-xs [&_label]:text-v1-content-secondary">
              <p>
                <label>{'MC: '}</label>
                <ReadableNumber
                  format={{ decimalLength: 1 }}
                  label="$"
                  popup="never"
                  value={row.symbol_market_data?.market_cap}
                />
              </p>
              <p>
                <label>{'24h V: '}</label>
                <ReadableNumber
                  format={{ decimalLength: 1 }}
                  label="$"
                  popup="never"
                  value={row.symbol_market_data?.volume_24h}
                />
              </p>
            </div>
          </div>
        );
      }}
      searchPlaceholder={`Search in ${
        networkName ? `${networkName} Network` : 'All Networks'
      }`}
      searchValue={query}
      showSearch
      value={undefined}
      {...props}
    />
  );
};
