import { clsx } from 'clsx';
import { doesNCoinHaveLargeTxns } from 'modules/discovery/ListView/NetworkRadar/lib';
import { NCoinAge } from 'modules/discovery/ListView/NetworkRadar/NCoinAge';
import { NCoinBuySell } from 'modules/discovery/ListView/NetworkRadar/NCoinBuySell';
import { NCoinDeveloper } from 'modules/discovery/ListView/NetworkRadar/NCoinDeveloper';
import type { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Coin } from 'shared/v1-components/Coin';
import { type ComplexSlug, useUnifiedCoinDetails } from './lib';

export const CoinTitleWidget: FC<{
  slug: ComplexSlug;
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
          'flex mobile:flex-col items-center gap-1 overflow-auto whitespace-nowrap',
          data?.symbol ? 'justify-between' : 'justify-center',
          className,
        )}
      >
        {data?.symbol ? (
          <div className="flex mobile:w-full w-full mobile:flex-wrap items-center justify-start gap-2">
            <Coin
              abbreviation={data.symbol.abbreviation}
              block
              categories={data.symbol.categories}
              customLabels={
                <>
                  {/* Developer Data */}
                  {data?.developer && <NCoinDeveloper value={data.developer} />}

                  {data.createdAt && (
                    <>
                      <span className="size-[2px] rounded-full bg-white" />
                      <NCoinAge
                        className="text-xs"
                        inline
                        value={data.createdAt}
                      />
                    </>
                  )}
                </>
              }
              href={false}
              labels={data.labels}
              links={data.links}
              logo={data.symbol.logo_url}
              name={data.symbol.name}
              networks={data.networks}
              security={data.goPlusSecurity}
              slug={data.symbol.slug}
              truncate={false}
            />
            {data.tradesData && (
              <div className="flex mobile:w-full items-center justify-start mobile:justify-between gap-4 mobile:gap-2">
                <div className="mobile:hidden h-4 w-px bg-white/10" />
                <div className="flex flex-col justify-between">
                  <p className="text-v1-content-secondary text-xs">
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
                    className="text-xs"
                    imgClassName="size-4"
                    value={{
                      buys: data.tradesData.total_num_buys,
                      sells: data.tradesData.total_num_sells,
                    }}
                  />
                </div>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex flex-col justify-between">
                  <p className="text-v1-content-secondary text-xs">
                    {t('common.volume')}
                    {' (24h)'}
                  </p>
                  <ReadableNumber
                    className="text-xs"
                    label="$"
                    popup="never"
                    value={data.marketData.trading_volume_24h}
                  />
                </div>

                <div className="h-4 w-px bg-white/10" />
                <div className="flex flex-col justify-between">
                  <p className="text-v1-content-secondary text-xs">
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
                    <span className="rounded-full bg-v1-content-negative/10 p-1 px-2 text-v1-content-negative text-xs">
                      {'Rugged'}
                    </span>
                  </>
                )}
              </div>
            )}
            {suffix && (
              <div className="flex grow items-center justify-end">{suffix}</div>
            )}
          </div>
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
