import { useMemo, useRef, type FC, useCallback, type MouseEvent } from 'react';
import { Scatter, type ScatterConfig } from '@ant-design/plots';
import { clsx } from 'clsx';
import html2canvas from 'html2canvas';
import { bxDownload } from 'boxicons-quasar';
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
  const isMobile = useIsMobile();
  const [share] = useShare('share');
  const el = useRef<HTMLDivElement>(null);
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
      animation: false,
      pointStyle: x => {
        return {
          fill: 'rgba(0, 0, 0, 0.2)',
          fillOpacity: 1,
          stroke: x.color,
          lineWidth: 2,
          shadowColor: x.color,
          shadowBlur: 15,
        };
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
          text: '~RSI Wise Scoring',
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
          text: '~MACD Wise Scoring',
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
        customContent: (_, data) => {
          const item: TechnicalRadarCoin | undefined = data[0]?.data?.raw;
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
                <>
                  <p className="flex justify-between gap-2">
                    <strong>{'Score:'}</strong>
                    <ReadableNumber popup="never" value={item.score} />
                  </p>
                  <p className="flex justify-between gap-2">
                    <strong>{'RSI Score:'}</strong>
                    <ReadableNumber popup="never" value={item.rsi_score} />
                  </p>
                  <p className="flex justify-between gap-2">
                    <strong>{'MACD Score:'}</strong>
                    <ReadableNumber popup="never" value={item.macd_score} />
                  </p>
                </>
              )}
              <p className="flex justify-between gap-2">
                <strong>~Price:</strong>
                <ReadableNumber
                  popup="never"
                  value={item.data?.current_price}
                  label="$"
                />
              </p>
              <p className="flex justify-between gap-2">
                <strong>~Price Change(24H):</strong>
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
      label: {
        formatter: x => {
          return x.label;
        },
        offsetY: 13,
        style: {
          fill: 'white',
          fontWeight: 'bold',
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
          content: type === 'cheap_bullish' ? '~Bullish ➡️' : '~Bearish ➡️',
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
          content: type === 'cheap_bullish' ? '~Cheap ➡️' : '~Expensive ➡️', // NAITODO
          style: {
            fill: 'white',
            fontSize: 12,
            textAlign: 'end',
          },
          rotate: -Math.PI / 2,
          offsetX: -16, // Adjust position to the left of y-axis
        },
      ],
      autoFit: true,
    };
  }, [parsedData, type]);

  const shareImage = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      if (!el.current) throw new Error('Element is not ready yet!');
      (e.target as HTMLButtonElement).disabled = true;
      const canvas = await html2canvas(el.current, {
        backgroundColor: '#1D1E23', // v1-surface-l3
        ignoreElements: x => !!x.ariaHidden,
      });
      const fileName = `~${type}.png`;

      if (isMobile) {
        canvas.toBlob(blob => {
          if (!blob) throw new Error('Error creating blob from html element!');
          const file = new File([blob], `~${type}.png`, { type: 'image/png' });
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
          <h2
            className={clsx(
              'text-base font-medium text-v1-content-primary',
              type === 'cheap_bullish'
                ? '[&_b]:text-v1-content-positive'
                : '[&_b]:text-v1-content-negative',
            )}
            dangerouslySetInnerHTML={{
              __html:
                type === 'cheap_bullish'
                  ? '~<b>Cheap & Bullish</b> Chart(RSI+MACD)'
                  : '~<b>Expensive & Bearish</b> Chart(RSI+MACD)',
            }}
          />
          <p className="text-xs capitalize text-v1-content-primary">
            {'~the size of each bubble reflects the 24-hour change.'}
          </p>
        </div>
        <button
          onClick={shareImage}
          aria-hidden
          className={clsx(
            'inline-flex h-7 items-center gap-1 rounded-full px-3 text-xs',
            'bg-v1-surface-l4 transition-all hover:brightness-110 active:brightness-90',
            'disabled:animate-pulse disabled:brightness-75',
          )}
        >
          <Icon name={bxDownload} size={16} />
          {'~Share'}
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
