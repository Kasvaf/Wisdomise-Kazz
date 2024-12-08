import { useMemo, type FC } from 'react';
import { clsx } from 'clsx';
import { type TechnicalRadarCoin } from 'api/market-pulse';
import { Coin, CoinLogo } from 'shared/Coin';
import { HoverTooltip } from 'shared/HoverTooltip';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ReadableNumber } from 'shared/ReadableNumber';
import { ReactComponent as CheapBullishBg } from './cheap_bullish.svg';
import { ReactComponent as ExpensiveBearishBg } from './expensive_brearish.svg';

export const TechnicalChart: FC<{
  type: 'cheap_bullish' | 'expensive_bearish';
  data: TechnicalRadarCoin[];
}> = ({ data, type }) => {
  const parsedData = useMemo(() => {
    const changes = data.map(x =>
      Math.abs(x.data?.price_change_percentage_24h ?? 0),
    );
    const rsiScores = data.map(x => x.rsi_score ?? 0);
    const macdScores = data.map(x => x.macd_score ?? 0);
    const maxChange = Math.max(...changes);
    const minChange = Math.min(...changes);
    const maxRsi = Math.max(...rsiScores);
    const minRsi = Math.min(...rsiScores);
    const maxMacd = Math.max(...macdScores);
    const minMacd = Math.min(...macdScores);
    const createPositionCalculator = (unique?: boolean) => {
      const set = new Set<number>();
      return (value: number, min: number, max: number) => {
        let ret = ((value - min) / (max - min)) * 100;
        if (unique) {
          while (set.has(ret)) {
            ret += 0.9;
          }
          set.add(ret);
        }
        return ret;
      };
    };
    const calcLeft = createPositionCalculator(true);
    const calcBottom = createPositionCalculator(true);
    const calcSize = createPositionCalculator(false);
    return data.map(x => ({
      ...x,
      _meta: {
        left: calcLeft(x.macd_score ?? 0, minMacd, maxMacd),
        bottom: calcBottom(x.rsi_score ?? 0, minRsi, maxRsi),
        size: calcSize(
          Math.abs(x.data?.price_change_percentage_24h ?? 0),
          minChange,
          maxChange,
        ),
      },
    }));
  }, [data]);

  const Bg =
    type === 'cheap_bullish'
      ? CheapBullishBg
      : type === 'expensive_bearish'
      ? ExpensiveBearishBg
      : null;
  if (!Bg) return null;

  return (
    <div className="relative">
      <Bg className="col-span-2 row-span-2 h-auto w-full" />

      <div className="absolute inset-0 size-full pb-[12%] pl-[21%] pr-[10%] pt-[28%]">
        <div className="group relative size-full">
          {parsedData.map(bubble => (
            <HoverTooltip
              key={JSON.stringify(bubble.symbol)}
              placement="topLeft"
              title={
                <>
                  <div className="flex items-center justify-between gap-2">
                    <Coin coin={bubble.symbol} popup={false} truncate={false} />
                    <div className="flex flex-col items-end">
                      <ReadableNumber
                        value={bubble.data?.current_price}
                        label="$"
                        popup="never"
                        className="text-sm"
                      />
                      <DirectionalNumber
                        value={bubble.data?.price_change_percentage_24h}
                        label="%"
                        className="text-xxs"
                        showIcon={false}
                        suffix=" (24H)"
                        popup="never"
                        showSign
                      />
                    </div>
                  </div>
                </>
              }
            >
              <div
                className={clsx(
                  'absolute overflow-hidden rounded-full',
                  'bg-v1-background-disabled',
                  'flex aspect-square h-auto flex-col items-center justify-center gap-[3px] border-2 p-[1%]',
                  '-translate-x-1/2 -translate-y-1/2',
                  'hover:z-10',
                  (bubble.data?.price_change_percentage_24h ?? 0) > 0
                    ? 'border-v1-border-positive'
                    : 'border-v1-border-negative',
                )}
                style={{
                  left: `${bubble._meta.left}%`,
                  bottom: `${bubble._meta.bottom}%`,
                  width: `${Math.max(bubble._meta.size / 5, 10)}%`,
                  fontSize: `${Math.min(
                    Math.max(bubble._meta.size / 5, 7),
                    10,
                  )}px`,
                }}
              >
                <CoinLogo
                  coin={bubble.symbol}
                  className="size-[60%] shrink-0"
                />
                <p className="max-w-[80%] overflow-hidden text-ellipsis font-bold">
                  {bubble.symbol.abbreviation}
                </p>
              </div>
            </HoverTooltip>
          ))}
        </div>
      </div>
    </div>
  );
};
