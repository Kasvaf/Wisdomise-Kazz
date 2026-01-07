import { bxHide, bxShow } from 'boxicons-quasar';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import { useHideToken } from 'modules/shared/BlacklistManager/useHideToken';
import Icon from 'modules/shared/Icon';
import { Button } from 'modules/shared/v1-components/Button';
import { formatNumber } from 'utils/numbers';

interface Position {
  id: string;
  token: string;
  tokenSymbol: string;
  tokenAddress: string;
  tokenImage?: string;
  bought: number;
  boughtValue: string;
  sold: number;
  soldValue: string;
  pnl: number;
  pnlPercent: number;
}

const formatCurrency = (value: number): string => {
  if (value === 0) return '$0';
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 1000) {
    const formatted = formatNumber(absValue, {
      compactInteger: true,
      separateByComma: false,
      decimalLength: 1,
      minifyDecimalRepeats: false,
      exactDecimal: true,
    });
    return `${sign}$${formatted}`;
  }

  return `${sign}$${absValue.toFixed(2)}`;
};

const DEMO_POSITIONS: Position[] = [
  {
    id: '1',
    token: 'BBW',
    tokenSymbol: 'BBW',
    tokenAddress: '9vMJfxuKxXBoEa7rM12mYLMwTacLMLDJqHozw96WQLuke',
    tokenImage: '/icons/tokens/wisebot.png',
    bought: 4000,
    boughtValue: '$0.3256',
    sold: 0,
    soldValue: '$0',
    pnl: 12_500,
    pnlPercent: 27.8,
  },
  {
    id: '2',
    token: 'PEPE',
    tokenSymbol: 'PEPE',
    tokenAddress: '8vMJfxuKxXBoEa7rM12mYLMwTacLMLDJqHozw96WQLuke',
    tokenImage: '/icons/tokens/green-logo.png',
    bought: 250_000,
    boughtValue: '$75.00',
    sold: 100_000,
    soldValue: '$35.00',
    pnl: -5250,
    pnlPercent: -7.0,
  },
];

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
        {DEMO_POSITIONS.map(position => (
          <div
            className="grid grid-cols-[1fr_100px_100px_120px] items-center gap-2 border-v1-background-primary border-b px-3 py-2.5 transition-colors hover:bg-v1-background-primary"
            key={position.id}
          >
            <div className="flex items-center gap-2">
              {position.tokenImage ? (
                <img
                  alt={position.tokenSymbol}
                  className="h-7 w-7 rounded-full object-cover"
                  src={position.tokenImage}
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-v1-surface-l2">
                  <span className="font-bold text-[10px] text-white">
                    {position.tokenSymbol.slice(0, 2)}
                  </span>
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-semibold text-white text-xs">
                  {position.token}
                </span>
                <span
                  className={`text-[10px] ${
                    position.pnl >= 0
                      ? 'text-v1-content-positive'
                      : 'text-v1-content-negative'
                  }`}
                >
                  {position.pnl >= 0 ? '+' : ''}
                  {formatCurrency(position.pnl)} ({position.pnl >= 0 ? '+' : ''}
                  {position.pnlPercent.toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-v1-content-positive text-xs">
                {position.boughtValue}
              </div>
              <div className="text-[10px] text-neutral-600">
                {position.bought.toLocaleString()} {position.tokenSymbol}
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-v1-content-negative text-xs">
                {position.soldValue}
              </div>
              <div className="text-[10px] text-neutral-600">
                {position.sold.toLocaleString()} {position.tokenSymbol}
              </div>
            </div>
            <div className="flex items-center justify-center gap-1">
              <HideTokenButton tokenAddress={position.tokenAddress} />
              <Button
                className="!text-v1-content-negative"
                size="2xs"
                variant="ghost"
              >
                Sell
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
