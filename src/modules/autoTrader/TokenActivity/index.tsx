import { useHasFlag, useLastCandleStream, useTokenPairsQuery } from 'api';
import { WRAPPED_SOLANA_SLUG } from 'api/chains/constants';
import { useSolanaSymbol } from 'api/symbol';
import { clsx } from 'clsx';
import { useTokenActivity } from 'modules/autoTrader/TokenActivity/useWatchTokenStream';
import { useActiveNetwork } from 'modules/base/active-network';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import { Coin } from 'shared/Coin';
import { Button } from 'shared/v1-components/Button';
import { formatNumber } from 'utils/numbers';
import { ReactComponent as UsdIcon } from './usd.svg';

export const BtnConvertToUsd = ({
  isUsd = true,
  onChange,
  className,
  disabled,
}: {
  isUsd?: boolean;
  onChange: (isUsd: boolean) => void;
  className?: string;
  disabled?: boolean;
}) => {
  return (
    <Button
      className={clsx(
        className,
        'text-white/50',
        isUsd && '!text-v1-content-positive',
      )}
      disabled={disabled}
      fab
      onClick={() => onChange(!isUsd)}
      size="3xs"
      variant="ghost"
    >
      <UsdIcon className="!size-4" />
    </Button>
  );
};

export function SolanaCoin({ className }: { className?: string }) {
  const { data: solanaSymbol } = useSolanaSymbol();
  return solanaSymbol ? (
    <Coin
      className={clsx('-mr-1', className)}
      coin={solanaSymbol}
      mini
      nonLink
      noText
    />
  ) : null;
}

export default function TokenActivity({ mini = false }: { mini?: boolean }) {
  const { symbol } = useUnifiedCoinDetails();
  const { settings, toggleShowActivityInUsd } = useUserSettings();
  const slug = symbol.slug;
  const { data } = useTokenActivity({ slug });
  const hasFlag = useHasFlag();

  const network = useActiveNetwork();
  const { data: pairs, isPending } = useTokenPairsQuery(slug);

  const hasSolanaPair =
    !isPending && pairs?.some(p => p.quote.slug === WRAPPED_SOLANA_SLUG);
  const showUsd = hasSolanaPair ? settings.show_activity_in_usd : true;

  const lastCandle = useLastCandleStream({
    market: 'SPOT',
    network,
    slug: symbol.slug ?? '',
    quote: WRAPPED_SOLANA_SLUG,
    convertToUsd: showUsd,
  });

  const unit = showUsd ? '$' : <SolanaCoin />;

  const totalBought = Number(
    (showUsd ? data?.totalBoughtUsd : data?.totalBought) ?? '0',
  );
  const totalSold = Number(
    (showUsd ? data?.totalSoldUsd : data?.totalSold) ?? '0',
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

  if (!hasFlag('/swap-activity')) return null;

  return (
    <div
      className={clsx(
        mini
          ? 'cursor-pointer border-white/5 border-t'
          : 'border-white/10 border-b',
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
                <BtnConvertToUsd
                  className="!absolute right-0"
                  disabled={!hasSolanaPair}
                  isUsd={showUsd}
                  onChange={toggleShowActivityInUsd}
                />
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
