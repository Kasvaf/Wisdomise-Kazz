/* eslint-disable import/max-dependencies */
import { type ReactNode, type FC } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { NCoinAge } from 'modules/discovery/ListView/NetworkRadar/NCoinAge';
import { NCoinBuySell } from 'modules/discovery/ListView/NetworkRadar/NCoinBuySell';
import { useCoinDetails, useNCoinDetails } from 'api/discovery';
import { ReadableNumber } from 'shared/ReadableNumber';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { NCoinDeveloper } from 'modules/discovery/ListView/NetworkRadar/NCoinDeveloper';
import {
  calcNCoinRiskLevel,
  doesNCoinHaveLargeTxns,
} from 'modules/discovery/ListView/NetworkRadar/lib';
import { Coin } from 'shared/v1-components/Coin';

export const CoinTitleWidget: FC<{
  slug: string;
  className?: string;
  hr?: boolean;
  suffix?: ReactNode;
}> = ({ slug, className, hr, suffix }) => {
  const { t } = useTranslation('network-radar');
  const coin = useCoinDetails({ slug });
  const nCoin = useNCoinDetails({ slug });
  const isLoading =
    coin.isLoading || nCoin.isLoading || coin.isPending || nCoin.isPending;
  const isNCoin = !!nCoin.data?.base_symbol;
  const symbol = nCoin.data?.base_symbol || coin.data?.symbol;
  const nCoinRiskLevel = calcNCoinRiskLevel({
    riskPercent: nCoin.data?.risk_percent ?? 0,
  });

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
            <div className="flex w-full items-center justify-start gap-2 mobile:w-full mobile:flex-wrap">
              <Coin
                abbreviation={symbol.abbreviation}
                name={symbol.name}
                slug={symbol.slug}
                logo={symbol.logo_url}
                href={false}
                categories={coin.data?.symbol.categories}
                networks={isNCoin ? [] : coin.data?.networks}
                labels={coin.data?.symbol_labels?.filter(x => !!x)}
                security={
                  isNCoin
                    ? []
                    : coin.data?.security_data?.map(x => x.symbol_security)
                }
                links={
                  nCoin.data?.base_community_data.links ||
                  coin.data?.community_data?.links
                }
                customLabels={
                  <>
                    {/* Developer Data */}
                    {nCoin.data?.dev && (
                      <NCoinDeveloper value={nCoin.data.dev} />
                    )}

                    {nCoin.data?.creation_datetime && (
                      <>
                        <span className="size-[2px] rounded-full bg-white" />
                        <NCoinAge
                          value={nCoin.data?.creation_datetime}
                          inline
                          className="text-xs"
                        />
                      </>
                    )}
                  </>
                }
                block
                truncate={false}
              />
              {nCoin.data && (
                <div className="flex items-center justify-start gap-4 mobile:w-full mobile:justify-between mobile:gap-2">
                  <div className="h-4 w-px bg-white/10 mobile:hidden" />
                  <div className="flex flex-col justify-between">
                    <p className="text-xs text-v1-content-secondary">
                      {t('common.buy_sell')}
                      {' (24h)'}
                      {doesNCoinHaveLargeTxns({
                        totalNumBuys: nCoin.data.update.total_num_buys ?? 0,
                        totalNumSells: nCoin.data.update.total_num_sells ?? 0,
                      })
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
                      value={nCoin.data.update.trading_volume.usd}
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
                          nCoinRiskLevel === 'low'
                            ? 'text-v1-content-positive'
                            : nCoinRiskLevel === 'medium'
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
              {suffix && (
                <div className="flex grow items-center justify-end">
                  {suffix}
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="w-full animate-pulse py-2 text-center text-sm">
            {t('common:almost-there')}
          </p>
        )}
      </div>
      {hr && symbol && <hr className="border-white/10" />}
    </>
  );
};
