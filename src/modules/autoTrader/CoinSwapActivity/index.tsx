import { useHasFlag, useTraderAssetActivity } from 'api';
import { delphinusGrpc } from 'api/grpc';
import { useSymbolInfo } from 'api/symbol';
import { clsx } from 'clsx';
import { useActiveNetwork } from 'modules/base/active-network';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import { useSearchParams } from 'react-router-dom';
import { Coin } from 'shared/Coin';
import { Button } from 'shared/v1-components/Button';
import { formatNumber } from 'utils/numbers';
import { ReactComponent as UsdIcon } from './usd.svg';

export default function CoinSwapActivity({ mini = false }: { mini?: boolean }) {
  const [searchParams] = useSearchParams();
  const { settings, toggleShowActivityInUsd } = useUserSettings();
  const { data } = useTraderAssetActivity(
    searchParams.get('slug') ?? undefined,
  );
  const isLoggedIn = useIsLoggedIn();
  const hasFlag = useHasFlag();

  const { data: solanaSymbol } = useSymbolInfo('wrapped-solana');
  const network = useActiveNetwork();
  const showUsd = settings.showActivityInUsd;

  const lastCandle = delphinusGrpc.useLastCandleStreamLastValue({
    market: 'SPOT',
    network,
    baseSlug: searchParams.get('slug') ?? '',
    quoteSlug: 'wrapped-solana',
    convertToUsd: showUsd,
  });

  const unit = showUsd
    ? '$'
    : solanaSymbol && (
        <Coin className="-mr-1" coin={solanaSymbol} mini nonLink noText />
      );

  const totalBought = Number(
    (showUsd ? data?.total_bought_usd : data?.total_bought) ?? '0',
  );
  const totalSold = Number(
    (showUsd ? data?.total_sold_usd : data?.total_sold) ?? '0',
  );
  const hold =
    Number(data?.balance ?? '0') *
    Number(lastCandle.data?.candle?.close ?? '0');

  const pnl = totalSold + hold - totalBought;
  const pnlPercent = totalBought === 0 ? 0 : (pnl / totalBought) * 100;
  const pnlSign = pnl >= 0 ? '+' : '-';

  const formatter = (value?: string | number) => {
    return formatNumber(Number(value ?? '0'), {
      decimalLength: 2,
      minifyDecimalRepeats: true,
      compactInteger: false,
      separateByComma: false,
    });
  };

  if (!isLoggedIn || !hasFlag('/swap-activity')) return null;

  return (
    <div
      className={clsx(
        mini
          ? 'cursor-pointer border-white/5 border-t'
          : 'mb-1 border-white/10 border-b',
      )}
      onClick={() => mini && toggleShowActivityInUsd()}
    >
      <div
        className={clsx(
          !mini && 'my-3 rounded-xl bg-v1-surface-l1 p-3',
          'px-3 text-xs',
        )}
      >
        {!mini && <p className="mb-4">Your Activity on This Token</p>}
        <div className={clsx('flex gap-2', mini && 'items-center')}>
          <div className="grow">
            {!mini && <p className="mb-2 text-v1-content-secondary">Bought</p>}
            <div
              className={clsx(
                'flex text-v1-content-positive',
                mini && 'justify-center',
              )}
            >
              {unit}
              {formatter(totalBought)}
            </div>
          </div>
          <div className="h-7 border-white/5 border-r" />
          <div className="grow">
            {!mini && <p className="mb-2 text-v1-content-secondary">Sold</p>}
            <div
              className={clsx(
                'flex text-v1-content-negative',
                mini && 'justify-center',
              )}
            >
              {unit}
              {formatter(totalSold)}
            </div>
          </div>
          <div className="h-7 border-white/5 border-r" />
          <div className="grow">
            {!mini && <p className="mb-2 text-v1-content-secondary">Holding</p>}
            <div className={clsx('flex', mini && 'justify-center')}>
              {unit}
              {formatter(hold)}
            </div>
          </div>
          <div className="h-7 border-white/5 border-r" />
          <div className="grow">
            {!mini && (
              <div className="relative mb-2 flex items-center gap-1">
                <span className="text-v1-content-secondary">PNL</span>
                <Button
                  className={clsx(
                    '!absolute right-0 text-white/70',
                    showUsd && '!text-v1-content-positive',
                  )}
                  fab
                  onClick={toggleShowActivityInUsd}
                  size="2xs"
                  variant="ghost"
                >
                  <UsdIcon />
                </Button>
              </div>
            )}
            <div
              className={
                pnlSign === '+'
                  ? 'text-v1-content-positive'
                  : 'text-v1-content-negative'
              }
            >
              {showUsd ? (
                <span
                  className={clsx(
                    'flex items-center',
                    mini && 'justify-center',
                  )}
                >
                  {pnlSign}
                  {unit}
                  {`${formatter(Math.abs(pnl))} (${pnlSign}${Math.abs(
                    pnlPercent,
                  ).toFixed(0)}%)`}
                </span>
              ) : (
                <span
                  className={clsx('flex items-start', mini && 'justify-center')}
                >
                  {unit}
                  {pnlSign}
                  {`${formatter(Math.abs(pnl))} (${pnlSign}${Math.abs(
                    pnlPercent,
                  ).toFixed(0)}%)`}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
