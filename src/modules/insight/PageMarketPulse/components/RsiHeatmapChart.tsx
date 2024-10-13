import { clsx } from 'clsx';
import { useMemo, useState, type ReactNode } from 'react';
import { Tooltip } from 'antd';
import { useTimeout } from 'usehooks-ts';
import { useTranslation } from 'react-i18next';
import {
  type IndicatorHeatmapResolution,
  type IndicatorHeatmap,
} from 'api/market-pulse';
import { Coin } from 'shared/Coin';
import { ReadableNumber } from 'shared/ReadableNumber';
import PriceChange from 'shared/PriceChange';
import { RsiNumber } from 'shared/RsiNumber';
import { RsiDivergence } from 'shared/RsiDivergence';

const AREA_SIZE_PERCENT = 42;
const POINT_SIZE = 14;

function HeatMapArea({
  type,
  children,
}: {
  type: 'oversold' | 'overbought';
  children?: ReactNode;
}) {
  const numbers = type === 'oversold' ? [30, 20, null] : [null, 80, 70];
  return (
    <div
      className={clsx(
        'absolute w-full',
        type === 'oversold' ? 'bottom-0' : 'top-0',
        type === 'oversold'
          ? 'bg-gradient-to-b from-[#1B7D61] to-[#30C299]'
          : 'bg-gradient-to-t from-[#8D1F2B] to-[#E74457]',
      )}
      style={{
        height: `${AREA_SIZE_PERCENT}%`,
      }}
    >
      <div
        className={clsx(
          'absolute left-0 flex h-full flex-col justify-between px-2 text-xs text-v1-content-primary',
          type === 'oversold' ? 'top-[-1ch]' : 'bottom-[-1ch]',
        )}
      >
        {numbers.map(number => (
          <span className={clsx(number === null && 'opacity-0')} key={number}>
            {number}
          </span>
        ))}
      </div>
      <div className="absolute right-0 flex h-full items-center justify-start px-4 text-xs text-v1-content-primary">
        <div className="h-auto -rotate-90 whitespace-nowrap px-[50%]">
          {type === 'oversold' ? 'Oversold Area' : 'Overbought Area'}
        </div>
      </div>
      {children}
    </div>
  );
}

function GuideBar() {
  const { t } = useTranslation('market-pulse');
  return (
    <div
      className={clsx(
        'flex shrink-0 flex-wrap items-center justify-center gap-x-6 gap-y-2 overflow-auto text-xs font-medium',
        '[&>*]:inline-flex [&>*]:shrink-0 [&>*]:items-center [&>*]:gap-2',
      )}
    >
      <div>
        <div className="size-4 rounded bg-v1-content-positive" />
        {t('indicator_list.rsi.heatmap.oversold_area')}
      </div>
      <div>
        <div className="size-4 rounded bg-v1-content-negative" />
        {t('indicator_list.rsi.heatmap.overbought_area')}
      </div>
      <div>
        <div className="h-4 w-0 border-r-2 border-dashed border-r-v1-content-primary" />
        {t('indicator_list.rsi.heatmap.price_change')}
      </div>
      <div>
        <div
          className="rounded-full border-[3px] border-v1-border-primary bg-v1-background-primary"
          style={{
            width: `${POINT_SIZE}px`,
            height: `${POINT_SIZE}px`,
          }}
        />
        {t('indicator_list.rsi.heatmap.no_divergence')}
      </div>
      <div>
        <div
          className="rounded-full border-[3px] border-v1-content-positive bg-v1-background-primary"
          style={{
            width: `${POINT_SIZE}px`,
            height: `${POINT_SIZE}px`,
          }}
        />
        {t('indicator_list.rsi.heatmap.bullish_divergence')}
      </div>
      <div>
        <div
          className="rounded-full border-[3px] border-v1-content-negative bg-v1-background-primary"
          style={{
            width: `${POINT_SIZE}px`,
            height: `${POINT_SIZE}px`,
          }}
        />
        {t('indicator_list.rsi.heatmap.bearish_divergence')}
      </div>
    </div>
  );
}

function CoinPoint({
  value,
  resolution,
}: {
  value: IndicatorHeatmap<'rsi'>;
  resolution: IndicatorHeatmapResolution;
}) {
  const { t } = useTranslation('market-pulse');
  const [isReady, setIsReady] = useState(false);
  useTimeout(() => setIsReady(true), 50);
  const top = useMemo(() => {
    let bottom = 0;
    const { rsi_value: rsi } = value;
    if (rsi < 0 || rsi > 100) return '-10%';
    if (rsi < 20) {
      const max = AREA_SIZE_PERCENT / 2;
      bottom = (100 / max) * rsi * (max / 100);
    } else if (rsi < 30) {
      bottom = (rsi - 20) * 2;
      bottom += AREA_SIZE_PERCENT / 2;
    } else if (rsi < 70) {
      bottom = (rsi - 30) * 0.4;
      bottom += AREA_SIZE_PERCENT;
    } else if (rsi < 80) {
      bottom = (rsi - 70) * 2;
      bottom += AREA_SIZE_PERCENT + (100 - AREA_SIZE_PERCENT * 2);
    } else {
      bottom = (rsi - 80) * 1.06;
      bottom +=
        AREA_SIZE_PERCENT +
        (100 - AREA_SIZE_PERCENT * 2) +
        AREA_SIZE_PERCENT / 2;
    }
    return `calc(${100 - bottom}% - ${POINT_SIZE / 2}px)`;
  }, [value]);
  return (
    <Tooltip
      className="bg-v1-surface-l4"
      title={
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-6">
            <Coin coin={value.symbol} mini />
            <ReadableNumber
              value={value.data?.current_price}
              label="usdt"
              className="mt-[2px]"
            />
          </div>
          <div className="flex items-center justify-between gap-6">
            {t('indicator_list.rsi.heatmap.24h_change')}
            <PriceChange value={value.data?.price_change_percentage_24h} />
          </div>
          <div className="flex items-center justify-between gap-6">
            {t('indicator_list.rsi.heatmap.market_cap')}
            <ReadableNumber value={value.data?.market_cap} label="$" />
          </div>
          <div className="h-px bg-v1-content-primary opacity-10" />
          <div className="flex items-center justify-between gap-6">
            {t('indicator_list.rsi.heatmap.rsi')} ({resolution.toUpperCase()})
            <RsiNumber value={value.rsi_value} />
          </div>
          <div className="flex items-center justify-between gap-6">
            {t('indicator_list.rsi.heatmap.div')} ({resolution.toUpperCase()})
            <RsiDivergence value={value.divergence_type} />
          </div>
        </div>
      }
    >
      <div
        className={clsx(
          'group relative cursor-help rounded-full border-[3px] bg-v1-background-primary transition-all duration-150 hover:contrast-150',
          typeof value.divergence_type === 'number'
            ? value.divergence_type >= 0
              ? 'border-v1-border-positive'
              : 'border-v1-border-negative'
            : 'border-v1-border-primary',
          isReady ? 'scale-100' : 'scale-0 opacity-0',
        )}
        style={{
          /*
            90 === top: 0%
            70 === top: AREA_SIZE_PERCENT%
            10 === bottom: 0%
            30 === bottom: AREA_SIZE_PERCENT%
            30 < x < 70: top: 50%
          */
          // top: `calc(${
          //   value.rsi_value <= 30
          //     ? 100 - (value.rsi_value - 10) * (AREA_SIZE_PERCENT / 20)
          //     : value.rsi_value >= 70
          //     ? (90 - value.rsi_value) * (90 / AREA_SIZE_PERCENT)
          //     : 50
          // }% - ${POINT_SIZE / 2}px)`,
          top,
          width: `${POINT_SIZE}px`,
          height: `${POINT_SIZE}px`,
        }}
      >
        <div
          className="absolute rounded-full transition-all"
          style={{
            height: `calc(100% + ${POINT_SIZE * 2}px)`,
            width: `calc(100% + ${POINT_SIZE * 2}px)`,
            top: `-${POINT_SIZE}px`,
            left: `-${POINT_SIZE}px`,
          }}
        />
        <p
          className="relative flex h-full items-center justify-center text-center text-xs font-semibold"
          style={{
            top:
              (value.data?.price_change_24h ?? 0) < 0
                ? `${POINT_SIZE + 4}px`
                : 'auto',
            bottom:
              (value.data?.price_change_24h ?? 0) >= 0
                ? `${POINT_SIZE + 4}px`
                : 'auto',
          }}
        >
          {value.symbol.abbreviation}
        </p>
        <div
          className={clsx(
            'absolute w-0 border-r-2 border-dashed border-v1-content-primary',
            'transition-all delay-75 duration-300 will-change-contents',
          )}
          style={{
            left: 'calc(50% - 1px)',
            top:
              (value?.data?.price_change_24h ?? 0) >= 0
                ? `${POINT_SIZE}px`
                : 'auto',
            bottom:
              (value.data?.price_change_24h ?? 0) < 0
                ? `${POINT_SIZE}px`
                : 'auto',
            height: isReady
              ? `${Math.max(
                  Math.abs((value.data?.price_change_percentage_24h ?? 0) * 5),
                  8,
                )}px`
              : '0px',
          }}
        />
      </div>
    </Tooltip>
  );
}

export function RsiHeatmapChart({
  className,
  data,
  resolution,
}: {
  className?: string;
  data: Array<IndicatorHeatmap<'rsi'>>;
  resolution: IndicatorHeatmapResolution;
}) {
  const sortedData = useMemo(
    () =>
      data.sort(
        (a, b) =>
          new Date(b.related_at).getTime() - new Date(a.related_at).getTime(),
      ),
    [data],
  );
  return (
    <div className={clsx('flex flex-col gap-3', className)}>
      <GuideBar />
      <div className="relative min-h-96 shrink-0 grow overflow-hidden rounded-xl">
        <div
          className="absolute size-full"
          style={{
            backgroundImage:
              'repeating-linear-gradient(-60deg, #40414f, #40414f 3rem, #2a2a31 3rem, #2a2a31 6rem)',
          }}
        >
          <HeatMapArea type="overbought" />
          <HeatMapArea type="oversold" />
        </div>
        <div
          className={clsx(
            'absolute ml-7 flex h-full w-[calc(100%-3.5rem)] flex-row justify-between gap-12 overflow-x-auto overflow-y-hidden px-6',
          )}
        >
          {sortedData.map(row => (
            <CoinPoint
              key={row.symbol.slug}
              value={row}
              resolution={resolution}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
