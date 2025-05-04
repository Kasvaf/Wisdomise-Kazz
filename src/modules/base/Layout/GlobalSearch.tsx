import { bxSearch } from 'boxicons-quasar';
import { useState, type ComponentProps, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'usehooks-ts';
import { useNavigate } from 'react-router-dom';
import Icon from 'shared/Icon';
import { useDetailedCoins } from 'api';
import { CoinLogo } from 'shared/Coin';
import { CoinLabels } from 'shared/CoinLabels';
import { ContractAddress } from 'shared/ContractAddress';
import { CoinCommunityLinks } from 'shared/CoinCommunityLinks';
import { Select } from 'shared/v1-components/Select';
import { ReadableNumber } from 'shared/ReadableNumber';
import { useGlobalNetwork } from 'shared/useGlobalNetwork';

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
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query);

  const coins = useDetailedCoins({
    query: debouncedQuery,
  });

  const navigate = useNavigate();

  return (
    <Select
      value={undefined}
      multiple={false}
      onChange={slug => {
        if (slug) navigate(`/coin/${slug}`);
      }}
      options={coins.data?.map(x => x.symbol.slug)}
      dialogClassName="w-[520px] mobile:w-auto"
      render={opt => {
        const row = coins.data?.find(x => x.symbol.slug === opt);
        if (!row) return '';
        return (
          <div className="flex items-center justify-between gap-4 px-2 py-3 mobile:px-1">
            <div className="flex items-center justify-start gap-2">
              <CoinLogo
                value={row.symbol}
                className="size-7"
                network={network}
              />
              <div className="flex flex-col justify-between gap-px whitespace-nowrap">
                <div className="flex items-center gap-1">
                  <p className="text-sm font-medium">
                    {row?.symbol.abbreviation ?? '---'}
                  </p>
                  <p className="max-w-14 overflow-hidden truncate text-xxs text-v1-content-secondary">
                    {row?.symbol.name ?? '---'}
                  </p>
                  <CoinLabels
                    labels={[...(row?.symbol_labels ?? [])].filter(x => !!x)}
                    coin={row.symbol}
                    security={row.symbol_security ? [row.symbol_security] : []}
                    size="xs"
                    clickable={false}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <ContractAddress
                    value={row.contract_address ?? true}
                    allowCopy={false}
                  />

                  {/* Socials */}
                  <CoinCommunityLinks
                    coin={row.symbol}
                    value={row.symbol_community_links}
                    contractAddresses={
                      row.contract_address ? [row.contract_address] : []
                    }
                    includeTwitterSearch={false}
                    size="xs"
                  />
                </div>
              </div>
            </div>
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
      searchPlaceholder={`Search in ${network
        .split('-')
        .map(p => p.toUpperCase().slice(0, 1) + p.toLowerCase().slice(1))
        .join(' ')} Network`}
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
