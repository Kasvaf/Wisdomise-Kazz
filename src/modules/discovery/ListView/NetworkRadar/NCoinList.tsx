/* eslint-disable import/max-dependencies */
import { type ReactNode, type FC, useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { bxPauseCircle } from 'boxicons-quasar';
import { type TrenchStreamResponseResult } from 'api/proto/network_radar';
import { ContractAddress } from 'shared/ContractAddress';
import { ReadableNumber } from 'shared/ReadableNumber';
import Icon from 'shared/Icon';
import { NCoinAge } from './NCoinAge';
import { NCoinSecurity } from './NCoinSecurity';
import { calcNCoinBCurveColor, doesNCoinHaveSafeTopHolders } from './lib';
import { NCoinTokenInsight } from './NCoinTokenInsight';
import { NCoinBuySell } from './NCoinBuySell';
import { NCoinLogo } from './NCoinLogo';

const NCoinBasicInfo: FC<{
  className?: string;
  value: TrenchStreamResponseResult;
}> = ({ className, value }) => (
  <div
    className={clsx(
      'flex flex-col items-start gap-1 overflow-hidden',
      className,
    )}
  >
    <p className="max-w-full truncate text-sm leading-none">
      {value.symbol?.name ?? ''}
    </p>
    <div className="flex items-center justify-start gap-1 text-xs">
      <p className="max-w-14 overflow-hidden text-ellipsis text-v1-content-secondary">
        {value.symbol?.base ?? ''}
      </p>
      <ContractAddress
        value={value.symbol?.contractAddress ?? ''}
        allowCopy
        className="whitespace-nowrap"
      />
      .
      <NCoinAge value={value.symbol?.createdAt} inline imgClassName="hidden" />
    </div>
    <NCoinSecurity
      type="row"
      imgClassName="size-[14px]"
      value={{
        freezable: value.securityData?.freezable ?? false,
        mintable: value.securityData?.mintable ?? false,
        lpBurned: value.securityData?.lpBurned ?? false,
        safeTopHolders: doesNCoinHaveSafeTopHolders({
          topHolders: value.validatedData?.top10Holding ?? 0,
          totalSupply: +(value.networkData?.totalSupply ?? '0') || 0,
        }),
      }}
    />
  </div>
);

const NCoinInsightRow: FC<{
  className?: string;
  value: TrenchStreamResponseResult;
}> = ({ className, value }) => (
  <div
    className={clsx(
      'flex flex-wrap items-center gap-1 whitespace-nowrap',
      className,
    )}
  >
    <div
      className={clsx(
        'flex w-[54px] flex-col items-center text-xs',
        value.networkData?.boundingCurve === 1 &&
          'pointer-events-none opacity-0',
      )}
      style={{
        color: calcNCoinBCurveColor({
          bCurvePercent: (value.networkData?.boundingCurve ?? 0) * 100,
        }),
      }}
    >
      <p className="text-v1-content-secondary">{'B Curve'}</p>
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
    <NCoinTokenInsight
      value={value.validatedData}
      type="row"
      imgClassName="size-4"
      className="text-xs"
    />
  </div>
);

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
  onRowClick?: (slug: string) => void;
}> = ({
  dataSource: _dataSource,
  title,
  titleSuffix,
  loading,
  className,
  onRowClick,
}) => {
  const [dataSource, setDataSource] = useState(_dataSource);
  const [hovered, setHovered] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    if (!hovered) {
      setDataSource(_dataSource);
    }
  }, [_dataSource, hovered]);

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
          {title}
          <div
            className={clsx(
              'flex items-center gap-1 text-xs text-v1-content-info transition-all',
              !hovered && 'pointer-events-none opacity-0',
            )}
          >
            <Icon name={bxPauseCircle} size={18} />
          </div>
          {titleSuffix && (
            <div className="flex w-auto shrink-0 grow items-center justify-end gap-2">
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
              className="relative flex max-w-full items-center justify-between rounded-lg p-2 transition-all bg-v1-surface-l-next hover:brightness-110"
              type="button"
              onClick={() => row.symbol?.slug && onRowClick?.(row.symbol.slug)}
            >
              <div className="flex w-3/4 flex-col gap-1 overflow-hidden">
                <div className="flex shrink-0 items-center gap-2">
                  <NCoinLogo value={row} className="shrink-0" />
                  <NCoinBasicInfo value={row} />
                </div>
                <NCoinInsightRow value={row} />
              </div>
              <NCoinMarketDataCol
                value={row}
                className="absolute end-2 h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
