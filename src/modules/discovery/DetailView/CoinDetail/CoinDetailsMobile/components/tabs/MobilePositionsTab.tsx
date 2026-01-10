import { bxHide, bxShow } from 'boxicons-quasar';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import { useHideToken } from 'modules/shared/BlacklistManager/useHideToken';
import Icon from 'modules/shared/Icon';
import { Button } from 'modules/shared/v1-components/Button';
import { useWallets } from 'services/chains/wallet';
import { useSwapPositionsQuery } from 'services/rest/trader';
import { compressByLabel } from 'utils/numbers';

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

const HideTokenButton = ({ tokenAddress }: { tokenAddress: string }) => {
  const { addBlacklist } = useUserSettings();
  const { isHiddenByCA } = useHideToken({
    address: tokenAddress,
    network: 'solana',
  });

  return (
    <Button
      className="!p-0.5 text-neutral-600 hover:text-white"
      fab={true}
      onClick={e => {
        if (tokenAddress) {
          addBlacklist(
            { type: 'ca', network: 'solana', value: tokenAddress },
            true,
          );
        }
        e.stopPropagation();
        e.preventDefault();
      }}
      size="3xs"
      variant="ghost"
    >
      <Icon name={isHiddenByCA ? bxShow : bxHide} size={12} />
    </Button>
  );
};

export function MobilePositionsTab() {
  const { primaryWallet } = useWallets();
  const address = primaryWallet?.address;

  const { data: positionsData, isLoading } = useSwapPositionsQuery({
    status: 'ACTIVE',
    page: 1,
    pageSize: 50,
    walletAddress: address,
  });

  const positions = positionsData?.results ?? [];

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-8">
        <span className="text-neutral-600 text-sm">Loading positions...</span>
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center py-8">
        <span className="text-neutral-600 text-sm">No active positions</span>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="min-w-[500px]">
        {/* Header */}
        <div className="sticky top-0 z-10 grid grid-cols-[1fr_100px_100px_120px] gap-2 border-v1-border-tertiary border-b bg-v1-background-primary px-3 py-2 font-medium text-[10px] text-neutral-600">
          <div>Token</div>
          <div className="text-right">Bought</div>
          <div className="text-right">Sold ↓</div>
          <div className="text-center">Actions</div>
        </div>

        {/* Positions List */}
        {positions.map((position, _index) => {
          // Calculate PnL from position data (all values are strings in API)
          const boughtUsd = Number.parseFloat(position.total_bought_usd) || 0;
          const soldUsd = Number.parseFloat(position.total_sold_usd) || 0;
          const _balance = Number.parseFloat(position.balance) || 0;
          // Since we don't have current_price, we'll just show bought/sold
          // PnL would need current price which isn't in this API response
          const pnl = soldUsd - boughtUsd; // Simplified - only realized PnL
          const pnlPercent = boughtUsd > 0 ? (pnl / boughtUsd) * 100 : 0;

          // Extract contract address from symbol_slug (format: network_contractAddress)
          const contractAddress = position.symbol_slug.split('_')[1] || '';
          const symbolAbbr = `${contractAddress.slice(0, 6)}...${contractAddress.slice(-4)}`;

          return (
            <div
              className="grid grid-cols-[1fr_100px_100px_120px] items-center gap-2 border-v1-background-primary border-b px-3 py-2.5 transition-colors hover:bg-v1-background-primary"
              key={position.key}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-v1-surface-l2">
                  <span className="font-bold text-[10px] text-white">
                    {symbolAbbr.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-white text-xs">
                    {symbolAbbr}
                  </span>
                  <span
                    className={`text-[10px] ${
                      pnl >= 0
                        ? 'text-v1-content-positive'
                        : 'text-v1-content-negative'
                    }`}
                  >
                    {pnl >= 0 ? '+' : ''}
                    {formatCurrency(pnl)} ({pnl >= 0 ? '+' : ''}
                    {pnlPercent.toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-v1-content-positive text-xs">
                  {formatCurrency(boughtUsd)}
                </div>
                <div className="text-[10px] text-neutral-600">
                  {Number.parseFloat(
                    position.total_asset_bought,
                  ).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}{' '}
                  tokens
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-v1-content-negative text-xs">
                  {formatCurrency(soldUsd)}
                </div>
                <div className="text-[10px] text-neutral-600">
                  {Number.parseFloat(position.total_asset_sold).toLocaleString(
                    undefined,
                    {
                      maximumFractionDigits: 2,
                    },
                  )}{' '}
                  tokens
                </div>
              </div>
              <div className="flex items-center justify-center gap-1">
                <HideTokenButton tokenAddress={contractAddress} />
                <Button
                  className="!text-v1-content-negative"
                  size="2xs"
                  variant="ghost"
                >
                  Sell
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
