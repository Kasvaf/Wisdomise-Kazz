import { bxSearch } from 'boxicons-quasar';
import { useState, type ComponentProps, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'usehooks-ts';
import Icon from 'shared/Icon';
import { Input } from 'shared/v1-components/Input';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import { useDetailedCoins } from 'api';
import { CoinLogo } from 'shared/Coin';
import { CoinLabels } from 'shared/CoinLabels';
import { ContractAddress } from 'shared/ContractAddress';
import { CoinCommunityLinks } from 'shared/CoinCommunityLinks';

export const GlobalSearch: FC<
  Omit<
    ComponentProps<typeof Input>,
    'prefixIcon' | 'value' | 'onChange' | 'placeholder' | 'type'
  >
> = props => {
  const { t } = useTranslation('common');
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query);

  const coins = useDetailedCoins({
    query: debouncedQuery,
  });

  // const navigate = useNavigate();

  return (
    <ClickableTooltip
      title={
        <div className="flex flex-col gap-1">
          {coins.data?.map((row, i) => (
            <div
              className="flex items-center justify-start gap-2"
              key={`${row?.contract_address ?? ''} ${
                row?.symbol.slug ?? ''
              } ${i}`}
            >
              <CoinLogo value={row.symbol} className="size-6" />
              <div className="flex flex-col justify-between gap-px">
                <div className="flex items-center gap-1">
                  <p className="text-xs font-medium">
                    {row?.symbol.abbreviation ?? '---'}
                  </p>
                  <p className="text-xxs text-v1-content-secondary">
                    {row?.symbol.name ?? '---'}
                  </p>
                  <CoinLabels
                    labels={[
                      row.is_in_coingecko ? 'coingecko' : 'new_born',
                      ...(row?.symbol_labels ?? []),
                    ].filter(x => !!x)}
                    coin={row.symbol}
                    security={row.symbol_security ? [row.symbol_security] : []}
                    size="xs"
                  />
                </div>
                <div className="flex items-center gap-1">
                  {row.contract_address && (
                    <ContractAddress value={row.contract_address} />
                  )}

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
          ))}
        </div>
      }
      className="!cursor-text"
      tooltipClassName="!max-w-[460px] !w-full"
      chevron={false}
    >
      <Input
        prefixIcon={
          <Icon name={bxSearch} className="text-v1-content-secondary" />
        }
        placeholder={t('search_coins')}
        type="string"
        value={query}
        onChange={newQuery => setQuery(newQuery)}
        {...props}
      />
    </ClickableTooltip>
  );
};
