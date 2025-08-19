import { useSearchParams } from 'react-router-dom';
import { clsx } from 'clsx';
import { useTraderAssetActivity } from 'api';
import { formatNumber } from 'utils/numbers';
import { Button } from 'shared/v1-components/Button';
import { useSymbolInfo } from 'api/symbol';
import { Coin } from 'shared/Coin';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import { delphinusGrpc } from 'api/grpc';
import { useActiveNetwork } from 'modules/base/active-network';
import { ReactComponent as UsdIcon } from './usd.svg';

export default function CoinSwapActivity({ mini = false }: { mini?: boolean }) {
  const [searchParams] = useSearchParams();
  const { settings, toggleShowActivityInUsd } = useUserSettings();
  const { data } = useTraderAssetActivity(
    searchParams.get('slug') ?? undefined,
  );

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
        <Coin coin={solanaSymbol} mini noText nonLink className="-mr-1" />
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

  return (
    <div
      className={clsx(
        mini
          ? 'cursor-pointer border-t border-white/5'
          : 'border-b mb-1 border-white/10',
      )}
      onClick={() => mini && toggleShowActivityInUsd()}
    >
      <div
        className={clsx(
          !mini && 'rounded-xl p-3 bg-v1-surface-l1 my-3',
          'text-xs px-3',
        )}
      >
        {!mini && <p className="mb-4">Your Activity on This Token</p>}
        <div className={clsx('flex gap-2', mini && 'items-center')}>
          <div className="grow">
            {!mini && <p className="text-v1-content-secondary mb-2">Bought</p>}
            <p
              className={clsx(
                'flex text-v1-content-positive',
                mini && 'justify-center',
              )}
            >
              {unit}
              {formatter(totalBought)}
            </p>
          </div>
          <div className="h-7 border-r border-white/5" />
          <div className="grow">
            {!mini && <p className="text-v1-content-secondary mb-2">Sold</p>}
            <p
              className={clsx(
                'flex text-v1-content-negative',
                mini && 'justify-center',
              )}
            >
              {unit}
              {formatter(totalSold)}
            </p>
          </div>
          <div className="h-7 border-r border-white/5" />
          <div className="grow">
            {!mini && <p className="text-v1-content-secondary mb-2">Holding</p>}
            <p className={clsx('flex', mini && 'justify-center')}>
              {unit}
              {formatter(hold)}
            </p>
          </div>
          <div className="h-7 border-r border-white/5" />
          <div className="grow">
            {!mini && (
              <div className="flex items-center gap-1 mb-2 relative">
                <span className="text-v1-content-secondary">PNL</span>
                <Button
                  size="2xs"
                  variant="ghost"
                  fab
                  className={clsx(
                    'text-white/70 !absolute right-0',
                    showUsd && '!text-v1-content-positive',
                  )}
                  onClick={toggleShowActivityInUsd}
                >
                  <UsdIcon />
                </Button>
              </div>
            )}
            <p
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
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
