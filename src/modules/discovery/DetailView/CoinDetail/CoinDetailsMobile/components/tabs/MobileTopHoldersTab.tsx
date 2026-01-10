import { bxFilter, bxLinkExternal, bxSortAlt2 } from 'boxicons-quasar';
import Icon from 'modules/shared/Icon';
import { ReactComponent as SolanaIcon } from 'modules/shared/NetworkIcon/solana.svg';
import { Button } from 'modules/shared/v1-components/Button';
import { useMemo, useState } from 'react';
import { useGrpc } from 'services/grpc/core';
import { compressByLabel } from 'utils/numbers';
import { useUnifiedCoinDetails } from '../../../lib';

const formatCurrency = (value: number): string => {
  if (value === 0) return '$0';
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 1000) {
    const { value: formattedValue, label } = compressByLabel(absValue);
    // Limit to 2 decimal places
    const numValue = Number.parseFloat(formattedValue);
    const truncatedValue = Math.floor(numValue * 100) / 100;
    return `${sign}$${truncatedValue}${label}`;
  }

  return `${sign}$${absValue.toFixed(2)}`;
};

export function MobileTopHoldersTab() {
  const [pnlSortOrder, setPnlSortOrder] = useState<'asc' | 'desc' | null>(null);
  const { symbol, marketData } = useUnifiedCoinDetails();

  const topHolders = useGrpc({
    service: 'network_radar',
    method: 'topHolderStream',
    payload: {
      network: symbol.network ?? undefined,
      tokenAddress: symbol.contractAddress ?? undefined,
      pageSize: 50,
    },
  });

  // Sort holders by balance (descending) by default, then by PnL if sort is active
  const sortedHolders = useMemo(() => {
    if (!topHolders.data?.wallets) return [];

    const sorted = [...topHolders.data.wallets];

    if (pnlSortOrder) {
      sorted.sort((a, b) => {
        const pnlA = a.realizedPnl ?? 0;
        const pnlB = b.realizedPnl ?? 0;
        return pnlSortOrder === 'asc' ? pnlA - pnlB : pnlB - pnlA;
      });
    } else {
      // Default: sort by balance (descending - highest first)
      sorted.sort((a, b) => (b.balance ?? 0) - (a.balance ?? 0));
    }

    return sorted;
  }, [topHolders.data?.wallets, pnlSortOrder]);

  // Toggle U. PnL sort order
  const handlePnlSort = () => {
    if (pnlSortOrder === null) {
      setPnlSortOrder('desc');
    } else if (pnlSortOrder === 'desc') {
      setPnlSortOrder('asc');
    } else {
      setPnlSortOrder(null);
    }
  };

  // Show loading state
  if (topHolders.isLoading || !topHolders.data) {
    return (
      <div className="flex flex-1 items-center justify-center py-8">
        <span className="text-neutral-600 text-sm">Loading holders...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="min-w-[800px]">
        {/* Header */}
        <div className="sticky top-0 z-10 grid grid-cols-[18px_28px_minmax(85px,100px)_minmax(95px,110px)_minmax(75px,90px)_minmax(75px,90px)_70px_minmax(70px,85px)_minmax(100px,120px)] gap-1 border-v1-border-tertiary border-b bg-v1-background-primary px-2 py-1.5 font-medium text-[9px] text-neutral-600">
          <div></div>
          <div></div>
          <div>Wallet</div>
          <div className="text-right">SOL (Active)</div>
          <div className="text-right">Bought</div>
          <div className="text-right">Sold</div>
          <Button
            className="!p-0 !text-neutral-600 hover:!text-white flex items-center justify-end gap-0.5"
            onClick={handlePnlSort}
            size="3xs"
            variant="ghost"
          >
            <span>PnL</span>
            <Icon name={bxSortAlt2} size={10} />
          </Button>
          <div className="text-right">Remain</div>
          <div className="text-right">Funding</div>
        </div>

        {/* Holders List */}
        {sortedHolders.map((holder, index) => {
          const totalPnl = holder.realizedPnl ?? 0;
          const remainingValue = holder.balance ?? 0;
          const totalSupply = marketData.totalSupply ?? 1;
          const remainingPercent = (remainingValue / totalSupply) * 100;

          return (
            <div
              className="grid grid-cols-[18px_28px_minmax(85px,100px)_minmax(95px,110px)_minmax(75px,90px)_minmax(75px,90px)_70px_minmax(70px,85px)_minmax(100px,120px)] items-center gap-1 border-v1-background-primary border-b px-2 py-1.5 transition-colors hover:bg-v1-background-primary"
              key={holder.walletAddress || index}
            >
              {/* Rank */}
              <div className="text-center text-[10px] text-neutral-600">
                {index + 1}
              </div>

              {/* Filter & External Link Icons */}
              <div className="flex items-center justify-center gap-0.5">
                <Icon
                  className="cursor-pointer text-neutral-600 transition-colors hover:text-white"
                  name={bxFilter}
                  size={10}
                />
                <Icon
                  className="cursor-pointer text-neutral-600 transition-colors hover:text-white"
                  name={bxLinkExternal}
                  size={10}
                />
              </div>

              {/* Wallet */}
              <div className="flex items-center gap-0.5">
                <span className="truncate font-mono text-[10px] text-white">
                  {holder.walletAddress?.slice(0, 6) || 'N/A'}...
                  {holder.walletAddress?.slice(-4) || ''}
                </span>
              </div>

              {/* SOL Balance & Last Active */}
              <div className="text-right">
                <div className="flex items-center justify-end gap-0.5">
                  <SolanaIcon className="inline-block h-2.5 w-2.5" />
                  <span className="font-mono text-[10px] text-white">
                    {remainingValue < 0.01
                      ? `0.0₃${Math.floor(remainingValue * 1000)}`
                      : remainingValue < 1
                        ? remainingValue.toFixed(3)
                        : remainingValue.toFixed(2)}
                  </span>
                </div>
                <span className="text-[9px] text-neutral-600">--</span>
              </div>

              {/* Bought */}
              <div className="text-right">
                <div className="font-mono text-[10px] text-white">
                  {formatCurrency(holder.volumeInflow ?? 0)}
                </div>
                <div className="text-[8px] text-neutral-600">
                  {holder.numInflows ?? 0} txns
                </div>
              </div>

              {/* Sold */}
              <div className="text-right">
                <div className="font-mono text-[10px] text-v1-content-negative">
                  {formatCurrency(holder.volumeOutflow ?? 0)}
                </div>
                <div className="text-[8px] text-neutral-600">
                  {holder.numOutflows ?? 0} txns
                </div>
              </div>

              {/* PnL */}
              <div className="text-right">
                <span
                  className={`font-mono font-semibold text-[10px] ${
                    totalPnl >= 0
                      ? 'text-v1-content-positive'
                      : 'text-v1-content-negative'
                  }`}
                >
                  {totalPnl >= 0 ? '+' : ''}
                  {formatCurrency(totalPnl)}
                </span>
              </div>

              {/* Remaining */}
              <div className="text-right">
                <div className="flex items-center justify-end gap-0.5">
                  <div
                    className={`h-1 w-1 rounded-full ${
                      remainingPercent > 10
                        ? 'bg-v1-content-negative'
                        : remainingPercent > 2
                          ? 'bg-yellow-500'
                          : 'bg-v1-content-positive'
                    }`}
                  />
                  <span className="font-mono text-[10px] text-white">
                    {formatCurrency(remainingValue)}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-[8px] text-neutral-600">
                    {remainingPercent.toFixed(1)}%
                  </span>
                  <div className="h-0.5 w-10 overflow-hidden rounded-full bg-v1-surface-l2">
                    <div
                      className={`h-full ${
                        remainingPercent > 10
                          ? 'bg-v1-content-negative'
                          : remainingPercent > 2
                            ? 'bg-yellow-500'
                            : 'bg-v1-content-positive'
                      }`}
                      style={{
                        width: `${Math.min(remainingPercent * 3, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Funding */}
              <div className="text-right">
                <span className="text-[10px] text-neutral-600">N/A</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
