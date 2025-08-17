import { useSearchParams } from 'react-router-dom';
import { clsx } from 'clsx';
import { useTraderAssetActivity } from 'api';
import { roundSensible } from 'utils/numbers';
import { Button } from 'shared/v1-components/Button';
import { useSymbolInfo } from 'api/symbol';
import { Coin } from 'shared/Coin';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import { ReactComponent as UsdIcon } from './usd.svg';

export default function CoinSwapActivity({ mini = false }: { mini?: boolean }) {
  const [searchParams] = useSearchParams();
  const { settings, toggleShowActivityInUsd } = useUserSettings();
  const { data } = useTraderAssetActivity(
    searchParams.get('slug') ?? undefined,
  );
  const { data: solanaSymbol } = useSymbolInfo('wrapped-solana');

  const showUsd = settings.showActivityInUsd;
  const unit = showUsd
    ? '$'
    : solanaSymbol && (
        <Coin coin={solanaSymbol} mini noText nonLink className="-mr-1" />
      );
  const pnlSign = Number(data?.pnl ?? 0) >= 0 ? '+' : '-';

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
        <div className="flex items-center gap-2">
          <div className="grow">
            {!mini && <p className="text-v1-content-secondary mb-2">Bought</p>}
            <p
              className={clsx(
                'flex text-v1-content-positive',
                mini && 'justify-center',
              )}
            >
              {unit}
              {roundSensible(
                (showUsd ? data?.total_bought_usd : data?.total_bought) ?? 0,
              )}
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
              {roundSensible(
                (showUsd ? data?.total_sold_usd : data?.total_sold) ?? 0,
              )}
            </p>
          </div>
          <div className="h-7 border-r border-white/5" />
          <div className="grow">
            {!mini && <p className="text-v1-content-secondary mb-2">Holding</p>}
            <p className={clsx('flex', mini && 'justify-center')}>
              {unit}
              {roundSensible((showUsd ? data?.hold_usd : data?.hold) ?? 0)}
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
                  {`${Math.abs(
                    Number(data?.usd_pnl ?? 0) ?? 0,
                  )} (${pnlSign}${Math.abs(
                    Number(data?.usd_pnl_percent ?? 0),
                  ).toFixed(0)}%)`}
                </span>
              ) : (
                <span
                  className={clsx(
                    'flex items-center',
                    mini && 'justify-center',
                  )}
                >
                  {unit}
                  {pnlSign}
                  {`${Math.abs(
                    Number(data?.pnl ?? 0) ?? 0,
                  )} (${pnlSign}${Math.abs(
                    Number(data?.pnl_percent ?? 0),
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
