import { useMemo, useRef, type FC, useCallback, type MouseEvent } from 'react';
import { Scatter, type ScatterConfig } from '@ant-design/plots';
import { clsx } from 'clsx';
import html2canvas from 'html2canvas';
import { bxDownload } from 'boxicons-quasar';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { type TechnicalRadarCoin } from 'api/market-pulse';
import { Coin } from 'shared/Coin';
import { ReadableNumber } from 'shared/ReadableNumber';
import { antChartTooltipConfig } from 'shared/HoverTooltip';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import Icon from 'shared/Icon';
import { useShare } from 'shared/useShare';
import useIsMobile from 'utils/useIsMobile';
import { isDebugMode } from 'utils/version';
import { useNormalizeTechnicalChartBubbles } from './useNormalizeTechnicalChartBubbles';

export const TechnicalChartWidget: FC<{
  type: 'cheap_bullish' | 'expensive_bearish';
  data: TechnicalRadarCoin[];
}> = ({ data, type }) => {
  const { t } = useTranslation('market-pulse');
  const chartRef = useRef();
  const isMobile = useIsMobile();
  const [share] = useShare('share');
  const el = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const parsedData = useNormalizeTechnicalChartBubbles(data, type);

  const config = useMemo<ScatterConfig>(() => {
    return {
      padding: [32, 32, 42, 42],
      appendPadding: 0,
      data: parsedData,
      height: 500,
      xField: 'x',
      yField: 'y',
      colorField: 'color',
      animation: true,
      pointStyle: x => {
        return {
          fill: 'black',
          fillOpacity: 0.2,
          stroke: x?.color,
          lineWidth: 2,
          shadowColor: x?.color,
          shadowBlur: 15,
        };
      },
      interactions: [{ type: 'element-highlight' }],
      state: {
        active: {
          style: {
            stroke: 'white',
            strokeOpacity: 0.8,
            fillOpacity: 0.3,
            zIndex: 2,
          },
        },
      },
      sizeField: 'size',
      size: [19, 40],
      shape: 'circle',
      yAxis: {
        nice: true,
        label: null,
        line: null,
        grid: {
          line: {
            style: {
              stroke: 'rgba(255, 255, 255, 0.12)',
              lineWidth: 1,
              lineDash: [2, 2],
            },
          },
        },
        tickCount: 25,
        title: {
          text: t('common.rsi_wise_scoring'),
          position: 'center',
          style: {
            fill: '#fff',
          },
          offset: 20,
        },
      },
      xAxis: {
        nice: true,
        label: null,
        line: null,
        grid: {
          line: {
            style: {
              stroke: 'rgba(255, 255, 255, 0.12)',
              lineWidth: 1,
              lineDash: [2, 2],
            },
          },
        },
        tickCount: 25,
        title: {
          text: t('common.macd_wise_scoring'),
          position: 'center',
          style: {
            fill: '#fff',
          },
          offset: 20,
        },
      },
      brush: {
        enabled: true,
      },
      tooltip: {
        ...antChartTooltipConfig,
        offset: 24,
        customContent: (_, data) => {
          const point = data[0]?.data as (typeof parsedData)[0];
          const item: TechnicalRadarCoin | undefined = point?.raw;
          if (!item) return;
          return (
            <div>
              <div>
                <Coin
                  coin={item.symbol}
                  popup={false}
                  nonLink
                  truncate={false}
                />
              </div>
              {isDebugMode && (
                <code className="whitespace-pre font-mono text-xxs font-light text-v1-background-notice">
                  {JSON.stringify(
                    {
                      score: item.score,
                      rsi_score: item.rsi_score,
                      macd_score: item.macd_score,
                      x: point.x,
                      y: point.y,
                      size: point.size,
                    },
                    null,
                    1,
                  )}
                </code>
              )}
              <p className="flex justify-between gap-2">
                <b>{t('common.price')}:</b>
                <ReadableNumber
                  popup="never"
                  value={item.data?.current_price}
                  label="$"
                />
              </p>
              <p className="flex justify-between gap-2">
                <b>{t('common.price_change_24h')}:</b>
                <DirectionalNumber
                  popup="never"
                  value={item.data?.price_change_percentage_24h}
                  label="%"
                  showIcon={false}
                  showSign
                />
              </p>
            </div>
          );
        },
      },
      legend: false,
      chartRef,
      label: {
        formatter: x => x?.label,
        autoRotate: true,
        offsetY: 13,
        style: {
          fill: 'white',
          fontWeight: 'bold',
          zIndex: 0,
        },
        layout: {
          type: 'limitInShape',
        },
      },
      style: {
        background:
          type === 'cheap_bullish'
            ? 'linear-gradient(225deg, #0A5740, transparent)'
            : 'linear-gradient(225deg, #5D1A22, transparent)',
      },
      renderer: 'canvas',
      className: 'rounded-xl overflow-hidden',
      annotations: [
        {
          type: 'text',
          position: ['max', 'min'], // Position at max x and y=0
          content:
            type === 'cheap_bullish'
              ? `${t('keywords.macd_bullish.label_equiv')} ➡️`
              : `${t('keywords.macd_bearish.label_equiv')} ➡️`,
          style: {
            fill: 'white',
            fontSize: 12,
            textAlign: 'end',
          },
          rotate: 0,
          offsetY: 20, // Adjust position above x-axis
        },
        {
          type: 'text',
          position: ['min', 'max'],
          content:
            type === 'cheap_bullish'
              ? `${t('keywords.rsi_oversold.label_equiv')} ➡️`
              : `${t('keywords.rsi_overbought.label_equiv')} ➡️`,
          style: {
            fill: 'white',
            fontSize: 12,
            textAlign: 'end',
          },
          rotate: -Math.PI / 2,
          offsetX: -16, // Adjust position to the left of y-axis
        },
      ],
      onEvent: (_, e) => {
        if (e.type !== 'click') return;
        const item: undefined | TechnicalRadarCoin = e?.data?.data?.raw;
        if (!item) return;
        navigate(`/coin/${item.symbol.slug ?? ''}`);
      },
      autoFit: true,
    };
  }, [parsedData, navigate, type, t]);

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
    <div className="space-y-6 rounded-xl bg-v1-surface-l3 p-6" ref={el}>
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
          )}
        >
          <Icon name={bxDownload} size={16} />
          {t('common.share')}
        </button>
      </div>
      <div>
        <div className="relative">
          <Scatter {...config} />
        </div>
      </div>
    </div>
  );
};
