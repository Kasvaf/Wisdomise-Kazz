import { clsx } from 'clsx';
import { doesNCoinHaveLargeTxns } from 'modules/discovery/ListView/NetworkRadar/lib';
import { NCoinAge } from 'modules/discovery/ListView/NetworkRadar/NCoinAge';
import { NCoinBuySell } from 'modules/discovery/ListView/NetworkRadar/NCoinBuySell';
import { NCoinDeveloper } from 'modules/discovery/ListView/NetworkRadar/NCoinDeveloper';
import type { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Coin } from 'shared/v1-components/Coin';
import { useUnifiedCoinDetails } from './lib';

export const CoinTitleWidget: FC<{
  className?: string;
  hr?: boolean;
  suffix?: ReactNode;
}> = ({ className, hr, suffix }) => {
  const { t } = useTranslation('network-radar');
  const {
    symbol,
    developer,
    createdAt,
    marketData,
    risks,
    securityData,
    isInitiating,
    socials,
  } = useUnifiedCoinDetails();

  return (
    <>
      <div
        className={clsx(
          'flex mobile:flex-col items-center gap-1 overflow-auto whitespace-nowrap',
          symbol ? 'justify-between' : 'justify-center',
          className,
        )}
      >
        <div className="flex mobile:w-full w-full mobile:flex-wrap items-center justify-start gap-2">
          <Coin
            abbreviation={isInitiating ? '...' : symbol.abbreviation}
            block
            categories={symbol.categories}
            customLabels={
              <>
                {/* Developer Data */}
                {developer && <NCoinDeveloper value={developer} />}

                {createdAt && (
                  <>
                    <span className="size-[2px] rounded-full bg-white" />
                    <NCoinAge className="text-xs" inline value={createdAt} />
                  </>
                )}
              </>
            }
            href={false}
            labels={symbol.labels}
            logo={symbol.logo}
            name={isInitiating ? '' : symbol.name}
            networks={[
              {
                contract_address: isInitiating
                  ? ''
                  : (symbol.contractAddress ?? ''),
                network: {
                  icon_url:
                    'https://coin-images.coingecko.com/asset_platforms/images/5/large/solana.png?1706606708',
                  name: 'Solana',
                  slug: 'solana',
                },
                symbol_network_type: symbol.contractAddress ? 'TOKEN' : 'COIN',
              },
            ]}
            slug={symbol.slug}
            socials={socials}
            truncate={isInitiating}
          />
          <div className="flex mobile:w-full items-center justify-start mobile:justify-between gap-4 mobile:gap-2">
            <>
              <div className="mobile:hidden h-4 w-px bg-white/10" />
              <div className="flex flex-col justify-between">
                <p className="text-v1-content-secondary text-xs">
                  {t('common.buy_sell')}
                  {' (24h)'}
                  {doesNCoinHaveLargeTxns({
                    totalNumBuys: marketData.totalNumBuys24h ?? 0,
                    totalNumSells: marketData.totalNumSells24h ?? 0,
                  })
                    ? ' 🔥'
                    : ''}
                </p>
                <NCoinBuySell
                  className="text-xs"
                  imgClassName="size-4"
                  value={{
                    buys: marketData.totalNumBuys24h ?? 0,
                    sells: marketData.totalNumSells24h ?? 0,
                  }}
                />
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex flex-col justify-between">
                <p className="text-v1-content-secondary text-xs">
                  Total Volume
                </p>
                <ReadableNumber
                  className="text-xs"
                  format={{
                    decimalLength: 1,
                  }}
                  label="$"
                  popup="never"
                  value={marketData.totalVolume}
                />
              </div>
            </>

            {risks && (
              <>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex flex-col justify-between">
                  <p className="text-v1-content-secondary text-xs">
                    {t('common.risk')}
                  </p>
                  <span className="text-xs">
                    <span
                      className={clsx(
                        risks?.risks.some(x => x.level === 'danger')
                          ? 'text-v1-content-negative'
                          : risks?.risks.length
                            ? 'text-v1-content-notice'
                            : 'text-v1-content-positive',
                      )}
                    >
                      {risks?.riskPercent ?? 0}
                    </span>
                    <span className="text-v1-content-secondary">/100</span>
                  </span>
                </div>
              </>
            )}

            {securityData?.rugged && (
              <>
                <div className="h-4 w-px bg-white/10" />
                <span className="rounded-full bg-v1-content-negative/10 p-1 px-2 text-v1-content-negative text-xs">
                  {'Rugged'}
                </span>
              </>
            )}
          </div>
          {suffix && (
            <div className="flex grow items-center justify-end">{suffix}</div>
          )}
        </div>
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
};
