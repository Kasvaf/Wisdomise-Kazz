import { ReactComponent as Logo } from 'assets/logo-white.svg';
import { bxShareAlt } from 'boxicons-quasar';
import { clsx } from 'clsx';
import type { EChartsOption, ScatterSeriesOption } from 'echarts';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { type FC, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from 'services/rest';
import {
  type TechnicalRadarCoin,
  useTechnicalRadarCoins,
} from 'services/rest/discovery';
import { AccessShield } from 'shared/AccessShield';
import { ECharts } from 'shared/ECharts';
import Icon from 'shared/Icon';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { useScreenshot } from 'shared/useScreenshot';
import { Button } from 'shared/v1-components/Button';
import { formatNumber } from 'utils/numbers';
import useIsMobile from 'utils/useIsMobile';
import { useNormalizeTechnicalChartBubbles } from './useNormalizeTechnicalChartBubbles';

export const TechnicalRadarChart: FC<{
  type: 'cheap_bullish' | 'expensive_bearish';
  onClick?: (coin: TechnicalRadarCoin) => void;
}> = ({ type, onClick }) => {
  const coins = useTechnicalRadarCoins({});
  const { t } = useTranslation('market-pulse');
  const isMobile = useIsMobile();
  const el = useRef<HTMLDivElement>(null);
  const { capture } = useScreenshot(el, {
    backgroundColor: '#1D1E23', // v1-surface-l3
    fileName: `${type}-${Date.now()}`,
  });
  const navigate = useNavigate();
  const parsedData = useNormalizeTechnicalChartBubbles(coins.data ?? [], type);
  const subscription = useSubscription();
  const isLoggedIn = useIsLoggedIn();

  const options = useMemo<EChartsOption>(() => {
    return {
      tooltip: {
        trigger: 'item',
        backgroundColor: '#282a32',
        textStyle: {
          color: '#ffffff',
        },
        formatter: (s, x) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
          /* @ts-expect-error */
          const name = s?.data?.name as string | undefined;
          const bubble = name
            ? parsedData.data.find(x => x.label === name)
            : null;
          return `<div style="background: #282a32; color: #FFF;">
            <div><b>${bubble?.raw.symbol.name ?? name ?? x}</b></div>
            <div>Price Change: <b style="color: ${
              bubble?.borderColor ?? ''
            };">${formatNumber(
              bubble?.raw.data?.price_change_percentage_24h ?? 0,
              {
                compactInteger: true,
                decimalLength: 2,
                minifyDecimalRepeats: true,
                separateByComma: true,
              },
            )}%</b></div>
          </div>`;
        },
        valueFormatter(_, dataIndex) {
          const raw = parsedData.data?.[dataIndex]?.raw;
          if (!raw) return '';
          return raw.symbol.name ?? '---';
        },
      },
      grid: {
        left: 42,
        bottom: 42,
        top: 16,
        right: 16,
        containLabel: true,
      },
      xAxis: [
        {
          type: 'value',
          min: parsedData.minX - 2,
          max: parsedData.maxX + 2,
          name: t('common.macd_wise_scoring'),
          nameLocation: 'middle',
          nameGap: 15,
          nameTextStyle: {
            color: 'white',
            fontSize: 15,
            fontWeight: 'bold',
          },
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: type === 'cheap_bullish' ? '#00ffa3' : '#f14056',
              width: 6,
            },
            onZero: false,
            symbol: ['none', 'arrow'],
            symbolSize: [15, 15],
            symbolOffset: [0, 5],
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.09)',
              type: 'dashed',
            },
          },
        },
        {
          type: 'value',
          position: 'bottom',
          name:
            type === 'cheap_bullish'
              ? t('keywords.macd_bullish.label_equiv')
              : t('keywords.macd_bearish.label_equiv'),
          nameTextStyle: {
            color: 'white',
            fontSize: 14,
            backgroundColor: '#333F4D',
            borderRadius: 8,
            padding: 7,
          },
          zlevel: 1,
          nameGap: -75,
          nameLocation: 'end',
          axisLine: {
            show: false,
            onZero: false,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          min: parsedData.minY - 2,
          max: parsedData.maxY + 2,
          name: t('common.rsi_wise_scoring'),
          nameLocation: 'middle',
          nameGap: 15,
          nameTextStyle: {
            color: 'white',
            fontSize: 15,
            fontWeight: 'bold',
          },
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: type === 'cheap_bullish' ? '#00ffa3' : '#f14056',
              width: 6,
            },
            onZero: false,
            symbol: ['none', 'arrow'],
            symbolSize: [15, 15],
            symbolOffset: [0, 5],
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.09)',
              width: 1,
              type: 'dashed',
            },
          },
        },
        {
          type: 'value',
          position: 'left',
          name:
            type === 'cheap_bullish'
              ? t('keywords.rsi_oversold.label_equiv')
              : t('keywords.rsi_overbought.label_equiv'),
          nameTextStyle: {
            color: 'white',
            fontSize: 14,
            backgroundColor: '#333F4D',
            borderRadius: 8,
            padding: 7,
          },
          zlevel: 1,
          nameGap: -45,
          nameLocation: 'end',
          axisLine: {
            show: false,
            onZero: false,
          },
        },
      ],
      series: [
        {
          type: 'scatter',
          data: parsedData.data.map(bubble => ({
            value: [bubble.x, bubble.y, bubble.size],
            itemStyle: {
              color: bubble.color,
              borderWidth: 4,
              borderColor: bubble.borderColor,
              shadowColor: 'black',
              shadowBlur: 1,
            },
            name: bubble.label,
          })),
          symbolSize: data => data[2],
          large: true,
          label: {
            show: true,
            position: 'inside',
            color: 'white',
            fontSize: 14,
            fontWeight: 'bold',
            opacity: 1,
            formatter: x => x.name,
          },
        } satisfies ScatterSeriesOption,
      ],
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: 0,
          filterMode: 'filter',
        },
        {
          type: 'inside',
          yAxisIndex: 0,
          filterMode: 'filter',
        },
      ],
      backgroundColor: {
        type: 'linear',
        x: 0,
        y: 1,
        x2: 1,
        y2: 0,
        colorStops: [
          {
            color: 'transparent',
            offset: 0,
          },
          {
            color: type === 'cheap_bullish' ? '#0A5740' : '#5D1A22',
            offset: 1,
          },
        ],
      },
      touchAction: 'none', // Ensure touch events are handled by the chart
    };
  }, [parsedData, t, type]);

  useLoadingBadge(coins.isFetching);

  return (
    <div
      className={clsx(
        '[&.capturing_[data-capture]]:block [&.capturing_[data-nocapture]]:hidden',
      )}
      ref={el}
    >
      <div className="relative mb-4 flex items-center justify-between gap-px">
        <p className="max-w-sm text-v1-content-primary text-xs" data-nocapture>
          {t('common.rsi_macd_chart.subtitle')}
        </p>
        <div data-nocapture>
          <Button
            className="!rounded-full"
            disabled={!isLoggedIn || subscription.level < 1}
            onClick={capture}
            size="xs"
            variant="ghost"
          >
            <Icon name={bxShareAlt} size={10} />
            {t('common.share')}
          </Button>
        </div>
        <div className="hidden h-[33px] w-full" data-capture>
          <Logo className="mx-auto mt-2 h-7 w-auto" />
        </div>
      </div>
      <AccessShield
        className="relative"
        mode="children"
        sizes={{
          guest: true,
          initial: true,
          free: true,
          vip: false,
        }}
      >
        <ECharts
          className="overflow-hidden rounded-xl"
          height={isMobile ? 400 : 500}
          onClick={e => {
            if (
              e.componentSubType === 'scatter' &&
              typeof e.dataIndex === 'number' &&
              parsedData.data[e.dataIndex]
            ) {
              if (typeof onClick === 'function') {
                setTimeout(() => {
                  if (parsedData.data[e.dataIndex].raw) {
                    onClick(parsedData.data[e.dataIndex].raw);
                  }
                }, 10);
              } else {
                navigate(
                  `/token/${parsedData.data[e.dataIndex].raw.symbol.slug}`,
                );
              }
            }
          }}
          options={options}
          renderer="canvas"
        />
      </AccessShield>
    </div>
  );
};
