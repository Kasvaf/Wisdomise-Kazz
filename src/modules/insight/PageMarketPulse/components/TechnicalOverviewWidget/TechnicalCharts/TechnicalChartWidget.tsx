import { useMemo, useRef, type FC, useCallback, type MouseEvent } from 'react';
import { clsx } from 'clsx';
import html2canvas from 'html2canvas';
import { bxDownload } from 'boxicons-quasar';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { type EChartsOption, type ScatterSeriesOption } from 'echarts';
import { type TechnicalRadarCoin } from 'api/market-pulse';
import Icon from 'shared/Icon';
import { useShare } from 'shared/useShare';
import useIsMobile from 'utils/useIsMobile';
// eslint-disable-next-line import/max-dependencies
import { ECharts } from 'shared/ECharts';
import { AccessSheild } from 'shared/AccessSheild';
import { useSubscription } from 'api';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { useNormalizeTechnicalChartBubbles } from './useNormalizeTechnicalChartBubbles';

export const TechnicalChartWidget: FC<{
  type: 'cheap_bullish' | 'expensive_bearish';
  data: TechnicalRadarCoin[];
}> = ({ data, type }) => {
  const { t } = useTranslation('market-pulse');
  const isMobile = useIsMobile();
  const [share] = useShare('share');
  const el = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const parsedData = useNormalizeTechnicalChartBubbles(data, type);
  const subscription = useSubscription();
  const isLoggedIn = useIsLoggedIn();

  const options = useMemo<EChartsOption>(() => {
    return {
      tooltip: {
        trigger: 'item',
        valueFormatter(_, dataIndex) {
          const raw = parsedData.data?.[dataIndex]?.raw;
          if (!raw) return '';
          return raw.symbol.name;
        },
      },
      grid: {
        left: 45,
        bottom: 45,
        top: 20,
        right: 20,
        containLabel: true,
      },
      xAxis: [
        {
          type: 'value',
          min: parsedData.minX - 1,
          max: parsedData.maxX + 1,
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
          min: parsedData.minY - 1,
          max: parsedData.maxY + 1,
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
              color: 'rgba(0, 0, 0, 0.06)',
              borderWidth: 4,
              borderColor: bubble.color,
              shadowColor: 'black',
              shadowBlur: 5,
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
      toolbox: {
        show: true,
        padding: 10,
        feature: {
          dataZoom: {},
        },
      },
    };
  }, [parsedData, t, type]);

  const shareImage = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      if (!el.current) throw new Error('Element is not ready yet!');
      (e.target as HTMLButtonElement).disabled = true;
      const canvas = await html2canvas(el.current, {
        backgroundColor: '#1D1E23', // v1-surface-l3
        ignoreElements: x => !!x.hasAttribute('data-' + 'nocapture'),
      });
      const fileName = `${type}-${Date.now()}.png`;

      if (isMobile) {
        canvas.toBlob(blob => {
          if (!blob) throw new Error('Error creating blob from html element!');
          const file = new File([blob], fileName, { type: 'image/png' });
          void share(file);
          (e.target as HTMLButtonElement).disabled = false;
        }, 'image/png');
      } else {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = fileName;
        link.click();
        (e.target as HTMLButtonElement).disabled = false;
      }
    },
    [isMobile, share, type],
  );

  return (
    <div
      className="space-y-6 rounded-xl bg-v1-surface-l3 p-6 mobile:p-4"
      ref={el}
    >
      <div className="flex items-start justify-between gap-px">
        <div className="space-y-1">
          <div
            className={clsx(
              'text-base font-medium text-v1-content-primary',
              type === 'cheap_bullish'
                ? '[&_b]:text-v1-content-positive'
                : '[&_b]:text-v1-content-negative',
            )}
          >
            <b>
              {`${
                type === 'cheap_bullish'
                  ? t('keywords.rsi_oversold.label_equiv')
                  : t('keywords.rsi_overbought.label_equiv')
              } & ${
                type === 'cheap_bullish'
                  ? t('keywords.rsi_bullish.label_equiv')
                  : t('keywords.rsi_bearish.label_equiv')
              }`}
            </b>{' '}
            {t('common.rsi_macd_chart.title')}
          </div>
          <p className="text-xs text-v1-content-primary">
            {t('common.rsi_macd_chart.subtitle')}
          </p>
        </div>
        <button
          onClick={shareImage}
          data-nocapture
          className={clsx(
            'inline-flex h-7 items-center gap-1 rounded-full px-3 text-xs',
            'bg-v1-surface-l4 transition-all hover:brightness-110 active:brightness-90',
            'disabled:animate-pulse disabled:brightness-75',
            (!isLoggedIn || subscription.level < 2) && 'hidden',
          )}
        >
          <Icon name={bxDownload} size={16} />
          {t('common.share')}
        </button>
      </div>
      <div>
        <AccessSheild mode="children" size={1} level={2} className="relative">
          <ECharts
            initOptions={{
              height: '500px',
              width: 'auto',
              renderer: 'canvas',
            }}
            onClick={e => {
              if (
                e.componentSubType === 'scatter' &&
                typeof e.dataIndex === 'number' &&
                parsedData.data[e.dataIndex]
              ) {
                navigate(
                  `/coin/${parsedData.data[e.dataIndex].raw.symbol.slug ?? ''}`,
                );
              }
            }}
            options={options}
            className="overflow-hidden rounded-xl"
          />
        </AccessSheild>
      </div>
    </div>
  );
};
