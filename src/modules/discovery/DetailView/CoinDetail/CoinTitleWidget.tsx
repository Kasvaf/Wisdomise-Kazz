/* eslint-disable import/max-dependencies */
import { type ReactNode, type FC } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { NCoinAge } from 'modules/discovery/ListView/NetworkRadar/NCoinAge';
import { NCoinBuySell } from 'modules/discovery/ListView/NetworkRadar/NCoinBuySell';
import { ReadableNumber } from 'shared/ReadableNumber';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { NCoinDeveloper } from 'modules/discovery/ListView/NetworkRadar/NCoinDeveloper';
import { doesNCoinHaveLargeTxns } from 'modules/discovery/ListView/NetworkRadar/lib';
import { Coin } from 'shared/v1-components/Coin';
import { useUnifiedCoinDetails } from './useUnifiedCoinDetails';

export const CoinTitleWidget: FC<{
  slug: string;
  className?: string;
  hr?: boolean;
  suffix?: ReactNode;
}> = ({ slug, className, hr, suffix }) => {
  const { t } = useTranslation('network-radar');
  const { data, isLoading } = useUnifiedCoinDetails({ slug });

  useLoadingBadge(isLoading);

  return (
    <>
      <div
        className={clsx(
          'flex items-center gap-1 overflow-auto whitespace-nowrap mobile:flex-col',
          data?.symbol ? 'justify-between' : 'justify-center',
          className,
        )}
      >
        {data?.symbol ? (
          <>
            <div className="flex w-full items-center justify-start gap-2 mobile:w-full mobile:flex-wrap">
              <Coin
                abbreviation={data.symbol.abbreviation}
                name={data.symbol.name}
                slug={data.symbol.slug}
                logo={data.symbol.logo_url}
                href={false}
                categories={data.symbol.categories}
                networks={data.networks}
                labels={data.labels}
                security={data.goPlusSecurity}
                links={data.links}
                customLabels={
                  <>
                    {/* Developer Data */}
                    {data?.developer && (
                      <NCoinDeveloper value={data.developer} />
                    )}

                    {data.createdAt && (
                      <>
                        <span className="size-[2px] rounded-full bg-white" />
                        <NCoinAge
                          value={data.createdAt}
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
              {data.tradesData && (
                <div className="flex items-center justify-start gap-4 mobile:w-full mobile:justify-between mobile:gap-2">
                  <div className="h-4 w-px bg-white/10 mobile:hidden" />
                  <div className="flex flex-col justify-between">
                    <p className="text-xs text-v1-content-secondary">
                      {t('common.buy_sell')}
                      {' (24h)'}
                      {doesNCoinHaveLargeTxns({
                        totalNumBuys: data.tradesData.total_num_buys ?? 0,
                        totalNumSells: data.tradesData.total_num_sells ?? 0,
                      })
                        ? ' 🔥'
                        : ''}
                    </p>
                    <NCoinBuySell
                      value={{
                        buys: data.tradesData.total_num_buys,
                        sells: data.tradesData.total_num_sells,
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
                      value={data.marketData.trading_volume_24h}
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
                          data.risks?.level === 'low'
                            ? 'text-v1-content-positive'
                            : data.risks?.level === 'medium'
                            ? 'text-v1-content-notice'
                            : 'text-v1-content-negative',
                        )}
                      >
                        {data.risks?.percentage ?? 0}
                      </span>
                      <span className="text-v1-content-secondary">/100</span>
                    </span>
                  </div>

                  {data.rugCheckSecurity.rugged && (
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
      {hr && data?.symbol && !isLoading && <hr className="border-white/10" />}
    </>
  );
};
