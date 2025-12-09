import { clsx } from 'clsx';
import { BtnTokenShare } from 'modules/discovery/DetailView/CoinDetail/BtnTokenShare';
import { doesNCoinHaveLargeTxns } from 'modules/discovery/ListView/NetworkRadar/lib';
import { NCoinAge } from 'modules/discovery/ListView/NetworkRadar/NCoinAge';
import { NCoinBuySell } from 'modules/discovery/ListView/NetworkRadar/NCoinBuySell';
import { NCoinDeveloper } from 'modules/discovery/ListView/NetworkRadar/NCoinDeveloper';
import {
  MetaTag,
  NCoinBCurve,
} from 'modules/discovery/ListView/NetworkRadar/NCoinList';
import type { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ReadableNumber } from 'shared/ReadableNumber';
import Skeleton from 'shared/v1-components/Skeleton';
import { Token } from 'shared/v1-components/Token';
import { useUnifiedCoinDetails } from './lib';

export const TokenTitle: FC<{
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
    securityData,
    validatedData,
    isInitiating,
    socials,
    meta,
  } = useUnifiedCoinDetails();

  return (
    <>
      <div
        className={clsx(
          'scrollbar-none relative flex items-center gap-1 overflow-auto whitespace-nowrap max-md:flex-col',
          symbol ? 'justify-between' : 'justify-center',
          className,
        )}
      >
        {symbol.name ? (
          <div className="flex items-center justify-start gap-2 max-md:w-full max-md:flex-wrap">
            <Token
              abbreviation={symbol.abbreviation ?? undefined}
              address={symbol.contractAddress ?? undefined}
              block
              categories={symbol.categories}
              header={
                <>
                  {developer && <NCoinDeveloper value={developer} />}
                  {createdAt && (
                    <>
                      <span className="size-[2px] rounded-full bg-white" />
                      <NCoinAge className="text-xs" inline value={createdAt} />
                    </>
                  )}
                  <BtnTokenShare />
                </>
              }
              labels={symbol.labels}
              link={false}
              logo={symbol.logo}
              marker={validatedData?.protocol?.logo}
              name={isInitiating ? '' : (symbol.name ?? undefined)}
              progress={marketData.boundingCurve ?? 1}
              socials={socials}
              truncate={isInitiating}
            />
            <div className="flex items-center justify-start gap-3 max-md:w-full max-md:justify-between max-md:gap-2">
              <>
                <div className="h-4 w-px bg-white/10 max-md:hidden" />
                <div className="flex flex-col justify-between gap-1">
                  <p className="text-v1-content-secondary text-xs">{'MC'}</p>
                  <ReadableNumber
                    className="text-base"
                    format={{
                      decimalLength: 1,
                    }}
                    label="$"
                    popup="never"
                    value={marketData.marketCap}
                  />
                </div>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex flex-col justify-between gap-2">
                  <p className="text-v1-content-secondary text-xs">{'Price'}</p>
                  <ReadableNumber
                    className="text-xs"
                    label="$"
                    value={marketData.currentPrice}
                  />
                </div>
                <div className="h-4 w-px bg-white/10 max-md:hidden" />
                <div className="flex flex-col justify-between gap-2">
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
                <div className="flex flex-col justify-between gap-2">
                  <p className="text-v1-content-secondary text-xs">B Curve</p>
                  <NCoinBCurve
                    className="text-xs"
                    value={marketData.boundingCurve ?? 1}
                  />
                </div>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex flex-col justify-between gap-2">
                  <p className="text-v1-content-secondary text-xs">
                    Trading Volume (24h)
                  </p>
                  <ReadableNumber
                    className="text-xs"
                    format={{
                      decimalLength: 1,
                    }}
                    label="$"
                    popup="never"
                    value={marketData.volume24h}
                  />
                </div>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex flex-col justify-between gap-2">
                  <p className="text-v1-content-secondary text-xs">
                    Total supply
                  </p>
                  <ReadableNumber
                    className="text-xs"
                    popup="never"
                    value={marketData.totalSupply}
                  />
                </div>
              </>

              {securityData?.rugged && (
                <>
                  <div className="h-4 w-px bg-white/10" />
                  <span className="rounded-full bg-v1-content-negative/10 p-1 px-2 text-v1-content-negative text-xs">
                    {'Rugged'}
                  </span>
                </>
              )}

              {meta && <MetaTag id={meta.id} title={meta.title} />}
            </div>
            {suffix && (
              <div className="flex grow items-center justify-end">{suffix}</div>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="!size-10" />
            <div className="flex flex-col text-2xs">
              <Skeleton className="mb-2 w-20" />
              <Skeleton className="w-36" />
            </div>
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        )}
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
};
