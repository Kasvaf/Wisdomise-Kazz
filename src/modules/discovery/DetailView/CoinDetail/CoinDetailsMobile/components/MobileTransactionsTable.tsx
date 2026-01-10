import { bxFilterAlt, bxPause, bxTime, bxUser } from 'boxicons-quasar';
import clsx from 'clsx';
import { openInScan } from 'modules/autoTrader/PageTransactions/TransactionBox/components';
import { BtnConvertToUsd, SolanaIcon } from 'modules/autoTrader/TokenActivity';
import { useTokenSwaps } from 'modules/autoTrader/useEnrichedSwaps';
import { usePausedData } from 'modules/autoTrader/usePausedData';
import { useSelectedCandle } from 'modules/autoTrader/useSelectedCandle';
import { useActiveNetwork } from 'modules/base/active-network';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import { useTrackedWallets } from 'modules/discovery/ListView/WalletTracker/useTrackedWallets';
import { Address } from 'modules/shared/Address';
import { DirectionalNumber } from 'modules/shared/DirectionalNumber';
import { HoverTooltip } from 'modules/shared/HoverTooltip';
import Icon from 'modules/shared/Icon';
import { ReadableDate } from 'modules/shared/ReadableDate';
import { ReadableNumber } from 'modules/shared/ReadableNumber';
import { Button } from 'modules/shared/v1-components/Button';
import { useMemo, useRef, useState } from 'react';
import { WRAPPED_SOLANA_SLUG } from 'services/chains/constants';
import { useWalletsAddresses } from 'services/chains/wallet';
import { useTokenPairsQuery } from 'services/rest';

export function MobileTransactionsTable() {
  const { symbol, marketData, developer } = useUnifiedCoinDetails();
  const network = useActiveNetwork();
  const asset = symbol.contractAddress!;
  const slug = symbol.slug;
  const trackedWallets = useTrackedWallets();
  const userWallets = useWalletsAddresses();
  const {
    startTime,
    endTime,
    cleanLines,
    enabled: filterTime,
    setEnabled: setFilterTime,
  } = useSelectedCandle();

  const containerRef = useRef<HTMLDivElement>(null);
  const { settings, updateSwapsPartial } = useUserSettings();

  const { data: pairs, isPending } = useTokenPairsQuery(slug);

  const [filterYou, setFilterYou] = useState(false);
  const [filterTracked, setFilterTracked] = useState(false);
  const [filterDev, setFilterDev] = useState(false);

  const filteredWallets = useMemo(
    () => [
      ...(filterDev && developer ? [developer.address] : []),
      ...(filterTracked ? trackedWallets.map(w => w.address) : []),
      ...(filterYou ? userWallets : []),
    ],
    [
      trackedWallets,
      userWallets,
      filterTracked,
      filterYou,
      filterDev,
      developer,
    ],
  );

  const hasSolanaPair =
    !isPending && pairs?.some(p => p.quote.slug === WRAPPED_SOLANA_SLUG);

  const totalSupply = marketData.totalSupply ?? 0;
  const showAmountInUsd = hasSolanaPair
    ? settings.swaps.show_amount_in_usd
    : true;
  const showMarketCap = settings.swaps.show_market_cap;

  const enabled = !!network && !!asset;
  const { data, isLoading } = useTokenSwaps({
    network,
    tokenAddress: asset,
    enabled,
    wallets: filteredWallets,
    startTime:
      filterTime && startTime
        ? new Date(startTime * 1000).toISOString()
        : undefined,
    endTime:
      filterTime && endTime
        ? new Date(endTime * 1000).toISOString()
        : undefined,
  });

  const { data: pausedData, isPaused } = usePausedData(data, containerRef);
  const partialData = useMemo(() => pausedData.slice(0, 200), [pausedData]);

  const maxAmount = pausedData.reduce((max, s) => {
    return Math.max(max, s.tokenAmount);
  }, 0);

  return (
    <div className="flex h-full flex-col bg-v1-background-primary">
      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-v1-border-tertiary border-b px-3 py-2">
        <div className="flex items-center gap-2">
          <HoverTooltip title="Filter By Selected Candle Timeframe">
            <Button
              className={clsx(filterTime && '!text-v1-content-brand')}
              fab
              onClick={() => {
                setFilterTime(!filterTime);
                cleanLines();
              }}
              size="2xs"
              surface={0}
              variant="ghost"
            >
              <Icon className="[&>svg]:size-4" name={bxTime} />
            </Button>
          </HoverTooltip>
          <Button
            className={clsx(
              filterDev && '!text-v1-content-brand',
              'text-white/60',
            )}
            onClick={() => setFilterDev(prev => !prev)}
            size="xs"
            surface={0}
            variant="ghost"
          >
            <Icon className="-ml-1 [&>svg]:size-3" name={bxFilterAlt} />
            Dev
          </Button>
          <Button
            className={clsx(
              filterTracked && '!text-v1-content-brand',
              'text-white/60',
            )}
            onClick={() => setFilterTracked(prev => !prev)}
            size="xs"
            surface={0}
            variant="ghost"
          >
            <Icon className="-ml-1 [&>svg]:size-3" name={bxFilterAlt} />
            Tracked
          </Button>
          <Button
            className={clsx(
              filterYou && '!text-v1-content-brand',
              'text-white/60',
            )}
            onClick={() => setFilterYou(prev => !prev)}
            size="xs"
            surface={0}
            variant="ghost"
          >
            <Icon className="-ml-1 [&>svg]:size-3" name={bxUser} />
            You
          </Button>
        </div>
        <div
          className={clsx(
            'flex items-center gap-1 text-v1-content-brand text-xs opacity-0',
            isPaused && '!opacity-100',
          )}
        >
          <Icon className="[&>svg]:size-4" name={bxPause} />
          Paused
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[1fr_70px_50px_45px] gap-2 border-v1-border-tertiary border-b px-3 py-2 font-medium text-[10px] text-white/60">
        <div className="flex items-center gap-1">
          Amount
          <BtnConvertToUsd
            disabled={!hasSolanaPair}
            isUsd={showAmountInUsd}
            onChange={() =>
              updateSwapsPartial({
                show_amount_in_usd: !showAmountInUsd,
              })
            }
          />
        </div>
        <div className="flex items-center gap-1">
          {showMarketCap ? 'MC' : 'Price'}
          <Button
            className="text-white/70"
            fab
            onClick={() =>
              updateSwapsPartial({ show_market_cap: !showMarketCap })
            }
            size="3xs"
            variant="ghost"
          >
            <div className="flex h-3 w-3 items-center justify-center rounded-full border border-white/60 text-[8px]">
              ↕
            </div>
          </Button>
        </div>
        <div>Trader</div>
        <div className="text-right">Age</div>
      </div>

      {/* Transaction List */}
      <div className="flex-1 overflow-y-auto" ref={containerRef}>
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-white/60 text-xs">
            Loading transactions...
          </div>
        ) : partialData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-white/60 text-xs">
            No Transaction Found
          </div>
        ) : (
          partialData.map(row => (
            <div
              className="relative grid grid-cols-[1fr_70px_50px_45px] gap-2 border-[#0a0a0a] border-b px-3 py-2.5 transition-colors hover:bg-v1-surface-l1"
              key={row.txId}
            >
              {/* Background gradient bar */}
              <div
                className={clsx(
                  row.dir === 'sell'
                    ? 'to-v1-background-negative/20'
                    : 'to-v1-background-positive/20',
                  'pointer-events-none absolute left-0 h-full min-w-1 rounded-l-lg bg-gradient-to-r from-0% from-transparent to-60%',
                  row.tokenAmount === maxAmount && 'rounded-r-lg',
                )}
                style={{ width: `${(row.tokenAmount / maxAmount) * 100}%` }}
              />

              {/* Amount */}
              <div className="relative flex items-center">
                {!showAmountInUsd && <SolanaIcon className="mr-1" />}
                <DirectionalNumber
                  className="text-xs"
                  direction={row.dir === 'sell' ? 'down' : 'up'}
                  format={{
                    decimalLength: 2,
                    compactInteger: true,
                    minifyDecimalRepeats: false,
                  }}
                  label={showAmountInUsd ? '$' : ''}
                  showIcon={false}
                  showSign={false}
                  value={
                    showAmountInUsd
                      ? row.tokenAmount * row.price
                      : row.solAmount
                  }
                />
              </div>

              {/* Price/Market Cap */}
              <div className="relative">
                <ReadableNumber
                  className="text-xs"
                  format={{
                    decimalLength: 2,
                    compactInteger: true,
                    minifyDecimalRepeats: false,
                  }}
                  label="$"
                  value={row.price * (showMarketCap ? totalSupply : 1)}
                />
              </div>

              {/* Trader */}
              <div className="relative">
                <Address className="text-xs" mode="mini" value={row.wallet} />
              </div>

              {/* Age */}
              <div className="relative text-right">
                <button onClick={() => openInScan('solana', { tx: row.txId })}>
                  <ReadableDate
                    className="text-xs hover:underline"
                    suffix=""
                    value={row.relatedAt}
                  />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
