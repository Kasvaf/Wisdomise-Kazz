import { bxFilterAlt, bxPause, bxTransfer, bxUser } from 'boxicons-quasar';
import clsx from 'clsx';
import { openInScan } from 'modules/autoTrader/PageTransactions/TransactionBox/components';
import { BtnConvertToUsd, SolanaIcon } from 'modules/autoTrader/TokenActivity';
import { useTokenSwaps } from 'modules/autoTrader/useEnrichedSwaps';
import { usePausedData } from 'modules/autoTrader/usePausedData';
import { useActiveNetwork } from 'modules/base/active-network';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import { useTrackedWallets } from 'modules/discovery/ListView/WalletTracker/useTrackedWallets';
import { useMemo, useRef, useState } from 'react';
import { WRAPPED_SOLANA_SLUG } from 'services/chains/constants';
import { useUserWallets } from 'services/chains/wallet';
import { useTokenPairsQuery } from 'services/rest';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import Icon from 'shared/Icon';
import { ReadableDate } from 'shared/ReadableDate';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Button } from 'shared/v1-components/Button';
import { Table } from 'shared/v1-components/Table';
import { Wallet } from 'shared/v1-components/Wallet';

const TokenSwaps: React.FC<{ className?: string }> = ({ className }) => {
  const { symbol, marketData, developer } = useUnifiedCoinDetails();
  const network = useActiveNetwork();
  const asset = symbol.contractAddress!;
  const slug = symbol.slug;
  const trackedWallets = useTrackedWallets();
  const userWallets = useUserWallets();

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
  });

  const { data: pausedData, isPaused } = usePausedData(data, containerRef);
  const partialData = useMemo(() => pausedData.slice(0, 200), [pausedData]);

  const maxAmount = pausedData.reduce((max, s) => {
    return Math.max(max, s.tokenAmount);
  }, 0);

  return (
    <div className={clsx(className)}>
      <div className="mr-3 mb-2 flex items-center">
        <Button
          className={clsx(filterDev && '!text-v1-content-brand')}
          onClick={() => setFilterDev(prev => !prev)}
          size="2xs"
          surface={0}
          variant="ghost"
        >
          <Icon className="-ml-1 [&>svg]:size-4" name={bxFilterAlt} />
          Dev
        </Button>
        <Button
          className={clsx(filterTracked && '!text-v1-content-brand')}
          onClick={() => setFilterTracked(prev => !prev)}
          size="2xs"
          surface={0}
          variant="ghost"
        >
          <Icon className="-ml-1 [&>svg]:size-4" name={bxFilterAlt} />
          Tracked
        </Button>
        <Button
          className={clsx(filterYou && '!text-v1-content-brand')}
          onClick={() => setFilterYou(prev => !prev)}
          size="2xs"
          surface={0}
          variant="ghost"
        >
          <Icon className="-ml-1 [&>svg]:size-4" name={bxUser} />
          You
        </Button>
        <div
          className={clsx(
            'ml-auto flex items-center gap-1 text-v1-content-brand text-xs opacity-0',
            isPaused && '!opacity-100',
          )}
        >
          <Icon className="[&>svg]:size-5" name={bxPause} />
          Paused
        </div>
      </div>
      <div ref={containerRef}>
        <Table
          columns={[
            {
              title: (
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
              ),
              key: 'amount',
              render: row => (
                <div className="flex items-center">
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
                  {!showAmountInUsd && <SolanaIcon className="mr-1" />}
                  <DirectionalNumber
                    className="text-xs"
                    direction={row.dir === 'sell' ? 'down' : 'up'}
                    format={{
                      decimalLength: 1,
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
              ),
            },
            {
              title: (
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
                    <Icon className="[&>svg]:!size-4" name={bxTransfer} />
                  </Button>
                </div>
              ),
              key: 'price',
              render: row => (
                <ReadableNumber
                  className="text-xs"
                  format={{
                    decimalLength: 2,
                  }}
                  label="$"
                  value={row.price * (showMarketCap ? totalSupply : 1)}
                />
              ),
            },
            {
              title: 'Trader',
              key: 'trader',
              render: row => (
                <Wallet address={row.wallet} className="text-xs" mode="mini" />
              ),
            },
            {
              title: 'Age',
              key: 'age',
              width: 30,
              render: row => (
                <button onClick={() => openInScan('solana', { tx: row.txId })}>
                  <ReadableDate
                    className="text-xs hover:underline"
                    suffix=""
                    value={row.relatedAt}
                  />
                </button>
              ),
            },
          ]}
          dataSource={partialData}
          isPaused={isPaused}
          loading={isLoading}
          rowClassName="relative"
          scrollable
          size="sm"
          surface={1}
        />
      </div>
    </div>
  );
};

export default TokenSwaps;
