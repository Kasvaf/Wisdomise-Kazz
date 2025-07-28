/* eslint-disable import/max-dependencies */
import { type ReactNode, type FC, useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { bxPauseCircle } from 'boxicons-quasar';
import { type TrenchStreamResponseResult } from 'api/proto/network_radar';
import { ReadableNumber } from 'shared/ReadableNumber';
import Icon from 'shared/Icon';
import { Coin } from 'shared/v1-components/Coin';
import { NCoinAge } from './NCoinAge';
import { NCoinSecurity } from './NCoinSecurity';
import { calcNCoinBCurveColor, doesNCoinHaveSafeTopHolders } from './lib';
import { NCoinTokenInsight } from './NCoinTokenInsight';
import { NCoinBuySell } from './NCoinBuySell';
import pumpFunLogo from './pumpfun.png';

const EXCHANGE_LOGOS = {
  pumpfun: pumpFunLogo,
  PumpSwap: pumpFunLogo,
};

const NCoinBCurve: FC<{
  className?: string;
  value: TrenchStreamResponseResult;
}> = ({ className, value }) => {
  return (
    <div
      className={clsx('flex items-center gap-1 text-xs', className)}
      style={{
        color: calcNCoinBCurveColor({
          bCurvePercent: (value.networkData?.boundingCurve ?? 0) * 100,
        }),
      }}
    >
      <p className="text-v1-content-secondary">{'B Curve:'}</p>
      <ReadableNumber
        popup="never"
        value={(value.networkData?.boundingCurve ?? 0) * 100}
        label="%"
        className="font-semibold"
        format={{
          decimalLength: 1,
        }}
      />
    </div>
  );
};

const NCoinMarketDataCol: FC<{
  className?: string;
  value: TrenchStreamResponseResult;
}> = ({ className, value }) => (
  <div
    className={clsx(
      'flex flex-col items-end justify-center gap-2 py-3 text-xs',
      className,
    )}
  >
    <div className="flex items-center gap-1">
      <p className="text-v1-content-secondary">{'MC: '}</p>
      <ReadableNumber
        popup="never"
        value={+(value.networkData?.marketCap ?? '0') || 0}
        label="$"
        format={{
          decimalLength: 2,
        }}
      />
    </div>
    <div className="flex items-center gap-1">
      <p className="text-v1-content-secondary">{'VOL: '}</p>
      <ReadableNumber
        popup="never"
        value={+(value.networkData?.volume ?? '0') || 0}
        label="$"
        format={{
          decimalLength: 2,
        }}
      />
    </div>
    <div className="flex items-center gap-1">
      <p className="text-v1-content-secondary">{'TXNS: '}</p>
      <NCoinBuySell
        value={{
          buys: value.networkData?.totalBuy,
          sells: value.networkData?.totalSell,
        }}
      />
    </div>
    <div className="flex items-center gap-1">
      <p className="text-v1-content-secondary">{'# of Holders: '}</p>
      <ReadableNumber
        popup="never"
        value={value.validatedData?.numberOfHolders}
      />
    </div>
  </div>
);

export const NCoinList: FC<{
  dataSource: TrenchStreamResponseResult[];
  title?: ReactNode;
  titleSuffix?: ReactNode;
  className?: string;
  loading?: boolean;
  mini?: boolean;
  onRowClick?: (slug: string) => void;
}> = ({
  dataSource: _dataSource,
  title,
  titleSuffix,
  loading,
  className,
  mini,
  onRowClick,
}) => {
  const [dataSource, setDataSource] = useState(_dataSource);
  const [hovered, setHovered] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    if (!hovered || dataSource.length === 0) {
      setDataSource(_dataSource);
    }
  }, [_dataSource, dataSource.length, hovered]);

  return (
    <div
      className={clsx(
        'flex flex-col gap-3 overflow-auto rounded-lg scrollbar-none',
        className,
      )}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {title && (
        <div className="sticky top-0 z-10 flex shrink-0 items-center gap-2 overflow-auto whitespace-nowrap rounded-lg px-3 py-2 text-sm shadow-xl bg-v1-surface-l-next scrollbar-none">
          <div
            className={clsx(
              hovered ? 'pointer-events-none opacity-100' : 'opacity-0',
              'absolute inset-0 size-full bg-v1-background-brand/10 transition-all',
            )}
          />
          <h3 className="relative">{title}</h3>
          <div
            className={clsx(
              'flex items-center gap-1 text-xs text-v1-content-info transition-all',
              !hovered && 'pointer-events-none opacity-0',
            )}
          >
            <Icon name={bxPauseCircle} size={18} />
          </div>
          {titleSuffix && (
            <div className="relative flex w-auto shrink-0 grow items-center justify-end gap-2">
              {titleSuffix}
            </div>
          )}
        </div>
      )}
      {loading ? (
        <p className="animate-pulse p-3 text-center text-xs text-v1-content-secondary">
          {t('common:almost-there')}
        </p>
      ) : dataSource.length === 0 ? (
        <p className="p-3 text-center text-xs text-v1-content-secondary">
          {t('common:data-incoming')}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {dataSource.map(row => (
            <button
              key={row.symbol?.slug}
              className="relative flex h-28 max-w-full items-center justify-between rounded-lg p-2 transition-all bg-v1-surface-l-next hover:brightness-110"
              type="button"
              onClick={() => row.symbol?.slug && onRowClick?.(row.symbol.slug)}
            >
              <div className="flex flex-col gap-1 overflow-hidden">
                <Coin
                  abbreviation={row.symbol?.abbreviation}
                  name={row.symbol?.name}
                  slug={row.symbol?.slug}
                  logo={row.symbol?.imageUrl}
                  // categories={row.symbol.categories}
                  // labels={row.symbol_labels}
                  marker={
                    EXCHANGE_LOGOS[(row.symbol?.exchange as never) || 'pumpfun']
                  }
                  progress={row.networkData?.boundingCurve ?? 1}
                  networks={[
                    {
                      contract_address: row.symbol?.base ?? '---',
                      network: {
                        slug: 'solana',
                        icon_url: '',
                        name: 'Solana',
                      },
                      symbol_network_type: 'TOKEN',
                    },
                  ]}
                  customLabels={
                    <>
                      <NCoinSecurity
                        type="row"
                        imgClassName="size-4"
                        value={{
                          freezable: row.securityData?.freezable ?? false,
                          mintable: row.securityData?.mintable ?? false,
                          lpBurned: row.securityData?.lpBurned ?? false,
                          safeTopHolders: doesNCoinHaveSafeTopHolders({
                            topHolders: row.validatedData?.top10Holding ?? 0,
                            totalSupply:
                              +(row.networkData?.totalSupply ?? '0') || 0,
                          }),
                        }}
                      />
                      <NCoinAge
                        value={row.symbol?.createdAt}
                        inline
                        className="ms-1 text-xs"
                        imgClassName="hidden"
                      />
                    </>
                  }
                  extra={[
                    row.networkData?.boundingCurve === 1 ? null : (
                      <NCoinBCurve key="bc" value={row} className="text-xs" />
                    ),
                    <NCoinTokenInsight
                      key="ins"
                      value={row.validatedData}
                      type="row"
                      imgClassName="size-2"
                      className="text-xxs"
                    />,
                  ]}
                  href={false}
                  truncate={!!mini}
                />
              </div>
              <NCoinMarketDataCol
                value={row}
                className={clsx('absolute end-2 h-full', mini && 'hidden')}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
