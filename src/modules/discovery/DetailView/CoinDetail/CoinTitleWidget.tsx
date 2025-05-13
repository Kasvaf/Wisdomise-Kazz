/* eslint-disable import/max-dependencies */
import { useMemo, type FC } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { NCoinAge } from 'modules/discovery/ListView/NetworkRadar/NCoinAge';
import { NCoinBuySell } from 'modules/discovery/ListView/NetworkRadar/NCoinBuySell';
import { useCoinDetails, useNCoinDetails } from 'api';
import { CoinLogo } from 'shared/Coin';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ReadableNumber } from 'shared/ReadableNumber';
import { isDebugMode } from 'utils/version';
import { CoinLabels } from 'shared/CoinLabels';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { CoinCommunityLinks } from 'shared/CoinCommunityLinks';
import { ContractAddress } from 'shared/ContractAddress';
import { useGlobalNetwork } from 'shared/useGlobalNetwork';
import { type CoinNetwork } from 'api/types/shared';
import { PriceAlertButton } from './PriceAlertButton';

export const CoinTitleWidget: FC<{
  slug: string;
  className?: string;
  hr?: boolean;
}> = ({ slug, className, hr }) => {
  const { t } = useTranslation('network-radar');
  const coin = useCoinDetails({ slug });
  const nCoin = useNCoinDetails({ slug });
  const [globalNetwork] = useGlobalNetwork();
  const isLoading =
    coin.isLoading || nCoin.isLoading || coin.isPending || nCoin.isPending;
  const isNCoin = !!nCoin.data?.base_symbol;
  const symbol = nCoin.data?.base_symbol || coin.data?.symbol;

  const networks = useMemo<CoinNetwork[]>(() => {
    const ret: CoinNetwork[] = [];
    if (nCoin.data?.base_contract_address && nCoin.data.network) {
      return [
        {
          contract_address: nCoin.data.base_contract_address,
          symbol_network_type: 'COIN',
          network: nCoin.data.network,
        },
      ];
    }
    if (coin?.data?.networks) {
      return coin?.data?.networks;
    }
    return ret;
  }, [nCoin.data, coin.data]);

  const matchedNetwork = networks.find(x => x.network.slug === globalNetwork);

  useLoadingBadge(isLoading);

  return (
    <>
      <div
        className={clsx(
          'flex items-center gap-1 overflow-auto whitespace-nowrap mobile:flex-col',
          symbol ? 'justify-between' : 'justify-center',
          className,
        )}
      >
        {symbol ? (
          <>
            <div className="flex items-center justify-start gap-2 mobile:w-full mobile:flex-wrap">
              <CoinLogo value={symbol} className="size-10" />
              <div className="flex flex-col justify-between gap-1">
                <div className="flex items-center gap-1">
                  <p className="text-base font-medium">
                    {symbol.abbreviation ?? '---'}
                  </p>
                  <p className="text-xs text-v1-content-secondary">
                    {symbol.name ?? '---'}
                  </p>
                  <CoinLabels
                    categories={coin.data?.symbol.categories}
                    networks={isNCoin ? [] : coin.data?.networks}
                    labels={coin.data?.symbol_labels?.filter(x => !!x)}
                    coin={symbol}
                    security={
                      isNCoin
                        ? []
                        : coin.data?.security_data?.map(x => x.symbol_security)
                    }
                    size="xs"
                    clickable
                  />
                </div>
                <div className="flex items-center gap-1">
                  {matchedNetwork && (
                    <>
                      <ContractAddress
                        value={
                          matchedNetwork.symbol_network_type === 'COIN'
                            ? true
                            : matchedNetwork.contract_address
                        }
                        fallbackAsNativeCoin={false}
                        className="text-xs text-v1-content-secondary"
                      />
                      <span className="size-[2px] rounded-full bg-white" />
                    </>
                  )}

                  {/* Socials */}
                  <CoinCommunityLinks
                    coin={symbol}
                    contractAddresses={networks.map(x => x.contract_address)}
                    value={
                      nCoin.data?.base_community_data.links ||
                      coin.data?.community_data?.links
                    }
                    size="xs"
                    includeTwitterSearch
                  />

                  {/* Developer Data */}
                  {isNCoin && isDebugMode && (
                    <>
                      <span className="size-[2px] rounded-full bg-white" />
                      <span className="text-xs text-v1-content-positive">
                        {'TODO: Dev'}
                      </span>
                    </>
                  )}
                  {/* TODO an user icon and his assets history */}

                  {nCoin.data?.creation_datetime && (
                    <>
                      <span className="size-[2px] rounded-full bg-white" />
                      <NCoinAge
                        value={nCoin.data?.creation_datetime}
                        inline
                        className="text-xs text-v1-background-secondary"
                      />
                    </>
                  )}
                </div>
              </div>
              {nCoin.data && (
                <div className="flex items-center justify-start gap-4 mobile:w-full mobile:justify-between mobile:gap-2">
                  <div className="h-4 w-px bg-white/10 mobile:hidden" />
                  <div className="flex flex-col justify-between">
                    <p className="text-xs text-v1-content-secondary">
                      {t('common.buy_sell')}
                      {' (24h)'}
                      {(nCoin.data.update.total_num_buys ?? 0) +
                        (nCoin.data.update.total_num_sells ?? 0) >
                      5000
                        ? ' 🔥'
                        : ''}
                    </p>
                    <NCoinBuySell
                      value={{
                        buys: nCoin.data?.update?.total_num_buys,
                        sells: nCoin.data?.update?.total_num_sells,
                      }}
                      className="text-xs"
                      imgClassName="size-4"
                    />
                  </div>
                  <div className="h-4 w-px bg-white/10" />
                  <div className="flex flex-col justify-between">
                    <p className="text-xs text-v1-content-secondary">
                      {t('common.volume')}
                      {' (24h)'}
                    </p>
                    <ReadableNumber
                      value={nCoin.data.update.total_trading_volume.usd}
                      className="text-xs"
                      label="$"
                      popup="never"
                    />
                  </div>

                  <div className="h-4 w-px bg-white/10" />
                  <div className="flex flex-col justify-between">
                    <p className="text-xs text-v1-content-secondary">
                      {t('common.risk')}
                    </p>
                    <span className="text-xs">
                      <span
                        className={clsx(
                          (nCoin.data.risk_percent ?? 0) < 15
                            ? 'text-v1-content-positive'
                            : (nCoin.data.risk_percent ?? 0) < 50
                            ? 'text-v1-content-notice'
                            : 'text-v1-content-negative',
                        )}
                      >
                        {nCoin.data.risk_percent ?? 0}
                      </span>
                      <span className="text-v1-content-secondary">/100</span>
                    </span>
                  </div>

                  {nCoin.data.rugged && (
                    <>
                      <div className="h-4 w-px bg-white/10" />
                      <span className="rounded-full bg-v1-content-negative/10 p-1 px-2 text-xs text-v1-content-negative">
                        {'Rugged'}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 mobile:w-full mobile:justify-between">
              <div className="flex flex-col items-end justify-between gap-1 mobile:items-start">
                <DirectionalNumber
                  value={
                    nCoin.data?.update.base_market_data.current_price ??
                    coin.data?.data?.current_price
                  }
                  label="$"
                  direction="up"
                  className="text-sm mobile:text-lg"
                  showIcon={false}
                  showSign={false}
                />
                {coin.data?.data?.price_change_percentage_24h && (
                  <DirectionalNumber
                    className="text-xs"
                    value={coin.data?.data?.price_change_percentage_24h}
                    label="%"
                    showSign
                    showIcon
                    suffix=" (24h)"
                  />
                )}
              </div>
              <div className="h-8 w-px bg-white/10 mobile:hidden" />
              <PriceAlertButton
                slug={slug}
                variant="outline"
                surface={1}
                size="md"
              />
            </div>
          </>
        ) : (
          <p className="w-full animate-pulse text-center text-sm">
            {t('common:almost-there')}
          </p>
        )}
      </div>
      {hr && symbol && <hr className="border-white/10" />}
    </>
  );
};
