import { Check, Copy, LinkIcon, Settings } from 'lucide-react';
import { useTradingSettings } from 'modules/discovery/providers/TradingSettingsProvider';
import { Dialog } from 'modules/shared/v1-components/Dialog';
import { useState } from 'react';

interface TradePanelProps {
  positions?: number;
  tokenAmount?: number;
  balance?: number;
  activePageTab?: string;
}

interface WalletConfig {
  id: string;
  name: string;
  address: string;
  balance: number;
  positions: number;
  isSelected: boolean;
}

export function MobileTradePanel({
  positions = 1,
  tokenAmount = 0,
  balance = 0,
  activePageTab = 'trade',
}: TradePanelProps) {
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState<number | null>(null);
  const [showPresetDrawer, setShowPresetDrawer] = useState(false);
  const [showOrderTypeDrawer, setShowOrderTypeDrawer] = useState(false);
  const [showWalletDrawer, setShowWalletDrawer] = useState(false);
  const [orderType, setOrderType] = useState<'Instant' | 'Market' | 'Limit'>(
    'Instant',
  );

  const { settings, setActivePreset } = useTradingSettings();
  const activePreset = settings.activePreset;

  const quickAmounts = [0.1, 0.2, 0.3, 0.6];
  const orderTypes: Array<'Instant' | 'Market' | 'Limit'> = [
    'Instant',
    'Market',
    'Limit',
  ];

  // Sample wallet data
  const [wallets, setWallets] = useState<WalletConfig[]>([
    {
      id: '1',
      name: 'Axiom Main',
      address: '4iKg5',
      balance: 0,
      positions: 15,
      isSelected: true,
    },
    {
      id: '2',
      name: 'Wallet',
      address: '9vF1p',
      balance: 0,
      positions: 0,
      isSelected: false,
    },
    {
      id: '3',
      name: 'Wallet',
      address: '6Ar9t',
      balance: 0,
      positions: 0,
      isSelected: false,
    },
    {
      id: '4',
      name: 'Wallet',
      address: '5ZiBG',
      balance: 0.021,
      positions: 3,
      isSelected: false,
    },
    {
      id: '5',
      name: 'Wallet',
      address: '3wsMn',
      balance: 0,
      positions: 0,
      isSelected: false,
    },
    {
      id: '6',
      name: 'Wallet',
      address: 'Asofa',
      balance: 0.025,
      positions: 1,
      isSelected: false,
    },
    {
      id: '7',
      name: 'Wallet',
      address: '2MPcs',
      balance: 1.593,
      positions: 2,
      isSelected: false,
    },
  ]);

  const toggleWalletSelection = (id: string) => {
    setWallets(prev =>
      prev.map(w => (w.id === id ? { ...w, isSelected: !w.isSelected } : w)),
    );
  };

  const selectAllWithBalance = () => {
    setWallets(prev => prev.map(w => ({ ...w, isSelected: w.balance > 0 })));
  };

  const unselectAll = () => {
    setWallets(prev => prev.map(w => ({ ...w, isSelected: false })));
  };

  const _selectedWallet = wallets.find(w => w.isSelected) || wallets[0];

  return (
    <div className="flex flex-col gap-2.5 border-[#1a1a1a] border-t bg-[#0a0a0a] px-3 py-2.5">
      {/* Row 1: Presets + Buy/Sell Toggle */}
      <div className="flex items-center gap-2">
        {/* Inline Preset Selector */}
        <div className="flex items-center rounded-md border border-[#252525] bg-[#1a1a1a] p-0.5">
          {(['P1', 'P2', 'P3'] as const).map(preset => (
            <button
              className={`rounded px-2 py-0.5 font-medium text-[10px] transition-all ${
                activePreset === preset
                  ? 'bg-[#BEFF21] text-black'
                  : 'text-[#606060] hover:bg-[#252525] hover:text-white'
              }`}
              key={preset}
              onClick={() => setActivePreset(preset)}
            >
              {preset}
            </button>
          ))}
          <button
            className="ml-0.5 rounded p-1 text-[#606060] transition-colors hover:bg-[#252525] hover:text-white"
            onClick={() => setShowPresetDrawer(true)}
            title="Preset Settings"
          >
            <Settings className="h-3 w-3" />
          </button>
        </div>

        {/* Buy/Sell Toggle - Right side */}
        <div className="flex-1"></div>
        <div className="flex shrink-0 items-center rounded-lg bg-[#1a1a1a] p-0.5">
          <button
            className={`rounded-md px-4 py-2 font-bold text-sm transition-all ${
              mode === 'buy'
                ? 'bg-[#BEFF21] text-black'
                : 'text-[#606060] hover:text-white'
            }`}
            onClick={() => setMode('buy')}
          >
            Buy
          </button>
          <button
            className={`rounded-md px-4 py-2 font-bold text-sm transition-all ${
              mode === 'sell'
                ? 'bg-[#ef4444] text-white'
                : 'text-[#606060] hover:text-white'
            }`}
            onClick={() => setMode('sell')}
          >
            Sell
          </button>
        </div>
      </div>

      {/* Row 2: Quick Amount Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {quickAmounts.map(amt => {
          const isSelected = amount === amt;
          return (
            <button
              className={`rounded-lg py-2.5 font-bold font-mono text-sm transition-all ${
                isSelected
                  ? mode === 'buy'
                    ? 'bg-[#BEFF21] text-black shadow-[0_0_10px_rgba(190,255,33,0.3)]'
                    : 'bg-[#ef4444] text-white shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                  : mode === 'buy'
                    ? 'border border-[#252525] bg-[#1a1a1a] text-[#BEFF21] hover:border-[#404040]'
                    : 'border border-[#252525] bg-[#1a1a1a] text-[#ef4444] hover:border-[#404040]'
              }`}
              key={amt}
              onClick={() => setAmount(amt)}
            >
              {amt}
            </button>
          );
        })}
      </div>

      {/* Sell Initials - Only in sell mode */}
      {mode === 'sell' && (
        <button className="w-full rounded-lg border border-[#ef4444]/20 bg-[#ef4444]/10 py-2 font-bold text-[#ef4444] text-xs transition-colors hover:bg-[#ef4444]/20">
          Sell Initials
        </button>
      )}

      {/* Preset Settings Drawer */}
      <Dialog
        className="bg-[#1f1f1f]"
        contentClassName="px-4 py-4 text-center"
        drawerConfig={{ position: 'bottom', closeButton: true }}
        header={
          <span className="font-semibold text-base text-white">
            Preset Settings
          </span>
        }
        mode="drawer"
        onClose={() => setShowPresetDrawer(false)}
        open={showPresetDrawer}
      >
        <p className="text-[#606060] text-sm">
          Preset settings configuration will be implemented here.
        </p>
      </Dialog>

      {/* Order Type Drawer */}
      <Dialog
        className="bg-[#1f1f1f]"
        contentClassName="flex flex-col py-2"
        drawerConfig={{ position: 'bottom', closeButton: true }}
        mode="drawer"
        onClose={() => setShowOrderTypeDrawer(false)}
        open={showOrderTypeDrawer}
      >
        {orderTypes.map(type => (
          <button
            className={`flex items-center justify-between px-4 py-4 text-left transition-colors ${
              orderType === type
                ? 'bg-[#1a1a1a] text-white'
                : 'text-[#808080] hover:bg-[#252525] hover:text-white'
            }`}
            data-testid={`button-order-type-${type.toLowerCase()}`}
            key={type}
            onClick={() => {
              setOrderType(type);
              setShowOrderTypeDrawer(false);
            }}
          >
            <span className="font-medium text-base">{type}</span>
            {orderType === type && <Check className="h-5 w-5 text-[#00D179]" />}
          </button>
        ))}
      </Dialog>

      {/* Wallet Selection Drawer */}
      <Dialog
        className="bg-[#1f1f1f]"
        contentClassName="flex flex-col max-h-[60vh] overflow-y-auto"
        drawerConfig={{ position: 'bottom', closeButton: true }}
        header={
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="rounded-md bg-[#252525] px-3 py-1.5 font-medium text-sm text-white transition-colors hover:bg-[#303030]"
                data-testid="button-unselect-all"
                onClick={unselectAll}
              >
                Unselect All
              </button>
              <button
                className="text-[#808080] text-sm transition-colors hover:text-white"
                data-testid="button-select-with-balance"
                onClick={selectAllWithBalance}
              >
                Select All with Balance
              </button>
            </div>
            <button
              className="p-1.5 text-[#606060] transition-colors hover:text-white"
              data-testid="button-wallet-settings"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        }
        mode="drawer"
        onClose={() => setShowWalletDrawer(false)}
        open={showWalletDrawer}
      >
        {wallets.map(wallet => (
          <button
            className="flex items-center gap-3 border-[#252525] border-b px-4 py-3 text-left transition-colors hover:bg-[#252525]"
            data-testid={`wallet-row-${wallet.id}`}
            key={wallet.id}
            onClick={() => toggleWalletSelection(wallet.id)}
          >
            {/* Selection Checkbox */}
            <div
              className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                wallet.isSelected
                  ? 'border-orange-500 bg-orange-500'
                  : 'border-[#404040]'
              }`}
              data-testid={`checkbox-wallet-${wallet.id}`}
            >
              {wallet.isSelected && <Check className="h-3 w-3 text-white" />}
            </div>

            {/* Wallet Info */}
            <div className="flex min-w-0 flex-1 flex-col">
              <span
                className={`font-medium text-sm ${
                  wallet.name === 'Axiom Main'
                    ? 'text-orange-400'
                    : 'text-white'
                }`}
              >
                {wallet.name}
              </span>
              <div className="flex items-center gap-1.5 text-[#606060] text-[11px]">
                <LinkIcon className="h-3 w-3" />
                <span>Off</span>
                <span className="text-[#404040]">{wallet.address}</span>
                <Copy className="h-3 w-3" />
              </div>
            </div>

            {/* Balance */}
            <div className="flex items-center gap-1">
              <span className="font-semibold text-[#9945FF] text-[10px]">
                SOL
              </span>
              <span
                className={`font-mono text-sm ${
                  wallet.balance > 0 ? 'text-[#00D179]' : 'text-[#606060]'
                }`}
              >
                {wallet.balance}
              </span>
            </div>

            {/* Position Count */}
            <span className="w-6 text-right text-sm text-white">
              {wallet.positions}
            </span>
          </button>
        ))}
      </Dialog>
    </div>
  );
}
