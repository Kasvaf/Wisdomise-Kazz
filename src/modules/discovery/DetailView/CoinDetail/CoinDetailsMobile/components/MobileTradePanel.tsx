import { bxCheck, bxCog, bxCopy, bxLink } from 'boxicons-quasar';
import type { TraderPreset } from 'modules/autoTrader/BuySellTrader/TraderPresets';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import Icon from 'modules/shared/Icon';
import { Button } from 'modules/shared/v1-components/Button';
import { ButtonSelect } from 'modules/shared/v1-components/ButtonSelect';
import { Dialog } from 'modules/shared/v1-components/Dialog';
import { Input } from 'modules/shared/v1-components/Input';
import { useEffect, useState } from 'react';
import { preventNonNumericInput } from 'utils/numbers';

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
  positions: _positions = 1,
  tokenAmount: _tokenAmount = 0,
  balance: _balance = 0,
  activePageTab: _activePageTab = 'trade',
}: TradePanelProps) {
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState<number | null>(null);
  const [showPresetDrawer, setShowPresetDrawer] = useState(false);
  const [showOrderTypeDrawer, setShowOrderTypeDrawer] = useState(false);
  const [showWalletDrawer, setShowWalletDrawer] = useState(false);
  const [orderType, setOrderType] = useState<'Instant' | 'Market' | 'Limit'>(
    'Instant',
  );

  const { settings: userSettings, updateQuickBuyActivePreset } =
    useUserSettings();

  const activePresetIndex =
    userSettings?.quick_buy?.terminal?.active_preset ?? 0;

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
    <div className="flex flex-col gap-2.5 border-v1-surface-l1 border-t bg-v1-background-primary px-3 py-2.5">
      {/* Row 1: Presets + Buy/Sell Toggle */}
      <div className="flex items-center gap-2">
        {/* Inline Preset Selector */}
        <div className="flex items-center gap-1">
          <ButtonSelect
            className="h-6"
            onChange={newPresetIndex =>
              updateQuickBuyActivePreset('terminal', newPresetIndex)
            }
            options={[
              { value: 0, label: 'P1' },
              { value: 1, label: 'P2' },
              { value: 2, label: 'P3' },
            ]}
            size="xxs"
            surface={1}
            value={activePresetIndex}
            variant="primary"
          />
          <Button
            className="text-neutral-600 hover:text-white"
            fab={true}
            onClick={() => setShowPresetDrawer(true)}
            size="3xs"
            title="Preset Settings"
            variant="ghost"
          >
            <Icon name={bxCog} size={12} />
          </Button>
        </div>

        {/* Buy/Sell Toggle - Right side */}
        <div className="flex-1"></div>
        <ButtonSelect
          buttonClassName="px-4 font-bold"
          onChange={newMode => setMode(newMode)}
          options={[
            {
              value: 'buy' as const,
              label: 'Buy',
              className:
                mode === 'buy' ? 'bg-v1-background-brand !text-black' : '',
            },
            {
              value: 'sell' as const,
              label: 'Sell',
              className:
                mode === 'sell' ? '!bg-v1-background-negative !text-white' : '',
            },
          ]}
          size="md"
          surface={1}
          value={mode}
        />
      </div>

      {/* Row 2: Quick Amount Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {quickAmounts.map(amt => {
          const isSelected = amount === amt;
          return (
            <Button
              block
              className={`font-mono ${
                isSelected
                  ? mode === 'buy'
                    ? 'shadow-[0_0_10px_rgba(190,255,33,0.3)]'
                    : 'shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                  : mode === 'buy'
                    ? 'text-v1-background-brand'
                    : 'text-v1-content-negative'
              }`}
              key={amt}
              onClick={() => setAmount(amt)}
              size="lg"
              surface={1}
              variant={
                isSelected
                  ? mode === 'buy'
                    ? 'primary'
                    : 'negative'
                  : 'outline'
              }
            >
              {amt}
            </Button>
          );
        })}
      </div>

      {/* Sell Initials - Only in sell mode */}
      {mode === 'sell' && (
        <Button
          block
          className="font-bold"
          size="lg"
          variant="negative_outline"
        >
          Sell Initials
        </Button>
      )}

      {/* Preset Settings Drawer */}
      <TraderPresetSettingsDrawer
        onClose={() => setShowPresetDrawer(false)}
        open={showPresetDrawer}
      />

      {/* Order Type Drawer */}
      <Dialog
        className="bg-v1-surface-l1"
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
                ? 'bg-v1-surface-l1 text-white'
                : 'text-neutral-500 hover:bg-v1-surface-l2 hover:text-white'
            }`}
            data-testid={`button-order-type-${type.toLowerCase()}`}
            key={type}
            onClick={() => {
              setOrderType(type);
              setShowOrderTypeDrawer(false);
            }}
          >
            <span className="font-medium text-base">{type}</span>
            {orderType === type && (
              <Icon
                className="text-v1-content-positive"
                name={bxCheck}
                size={20}
              />
            )}
          </button>
        ))}
      </Dialog>

      {/* Wallet Selection Drawer */}
      <Dialog
        className="bg-v1-surface-l1"
        contentClassName="flex flex-col max-h-[60vh] overflow-y-auto"
        drawerConfig={{ position: 'bottom', closeButton: true }}
        header={
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                data-testid="button-unselect-all"
                onClick={unselectAll}
                size="sm"
                surface={2}
                variant="ghost"
              >
                Unselect All
              </Button>
              <Button
                className="text-neutral-500"
                data-testid="button-select-with-balance"
                onClick={selectAllWithBalance}
                size="sm"
                variant="link"
              >
                Select All with Balance
              </Button>
            </div>
            <Button
              className="text-neutral-600"
              data-testid="button-wallet-settings"
              fab={true}
              size="sm"
              variant="ghost"
            >
              <Icon name={bxCog} size={20} />
            </Button>
          </div>
        }
        mode="drawer"
        onClose={() => setShowWalletDrawer(false)}
        open={showWalletDrawer}
      >
        {wallets.map(wallet => (
          <button
            className="flex items-center gap-3 border-v1-border-tertiary border-b px-4 py-3 text-left transition-colors hover:bg-v1-surface-l2"
            data-testid={`wallet-row-${wallet.id}`}
            key={wallet.id}
            onClick={() => toggleWalletSelection(wallet.id)}
          >
            {/* Selection Checkbox */}
            <div
              className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                wallet.isSelected
                  ? 'border-orange-500 bg-orange-500'
                  : 'border-v1-surface-l4'
              }`}
              data-testid={`checkbox-wallet-${wallet.id}`}
            >
              {wallet.isSelected && (
                <Icon className="text-white" name={bxCheck} size={12} />
              )}
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
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-600">
                <Icon name={bxLink} size={12} />
                <span>Off</span>
                <span className="text-v1-surface-l4">{wallet.address}</span>
                <Icon name={bxCopy} size={12} />
              </div>
            </div>

            {/* Balance */}
            <div className="flex items-center gap-1">
              <span className="font-semibold text-[10px] text-v1-background-secondary">
                SOL
              </span>
              <span
                className={`font-mono text-sm ${
                  wallet.balance > 0
                    ? 'text-v1-content-positive'
                    : 'text-neutral-600'
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

function TraderPresetSettingsDrawer({
  onClose,
  open,
}: {
  onClose: () => void;
  open: boolean;
}) {
  const { settings, updatePreset } = useUserSettings();
  const [presets, setPresets] = useState(settings?.presets);
  const [currentPreset, setCurrentPreset] = useState(0);
  const [currentMode, setCurrentMode] = useState<'buy' | 'sell'>('buy');

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(() => {
    if (settings?.presets) {
      setPresets([...settings.presets]);
    }
  }, [open, settings?.presets]);

  if (!presets || !settings?.presets) return null;

  return (
    <Dialog
      className="bg-v1-surface-l1"
      contentClassName="p-7"
      drawerConfig={{ position: 'bottom', closeButton: true }}
      mode="drawer"
      onClose={onClose}
      open={open}
    >
      <div>
        <h1 className="mb-8 font-medium text-2xl">Quick Settings</h1>
        <p className="mb-3 text-xs">Presets</p>
        <ButtonSelect
          className="mb-3"
          onChange={setCurrentPreset}
          options={
            settings?.presets?.map((_, index) => ({
              value: index,
              label: `P${index + 1}`,
            })) ?? []
          }
          size="md"
          surface={2}
          value={currentPreset}
          variant="white"
        />
        <ButtonSelect
          className="mb-6"
          onChange={setCurrentMode}
          options={[
            {
              value: 'buy',
              label: 'Buy Settings',
              className:
                'aria-checked:!bg-v1-background-positive aria-checked:!text-v1-content-secondary-inverse',
            },
            {
              value: 'sell',
              label: 'Sell Settings',
              className:
                'aria-checked:!bg-v1-background-negative aria-checked:!text-v1-content-secondary-inverse',
            },
          ]}
          size="md"
          surface={2}
          value={currentMode}
        />
        <TraderPresetForm
          defaultValue={presets[currentPreset][currentMode]}
          key={currentMode + String(currentPreset)}
          onChange={newValue => {
            setPresets(prev => {
              const newPresets = [...(prev ?? [])];
              newPresets[currentPreset][currentMode] = newValue;
              return newPresets;
            });
          }}
          surface={2}
        />

        <div className="mt-6 flex items-center justify-between gap-2">
          <Button className="w-full" onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button
            className="w-full"
            onClick={() => {
              updatePreset(presets);
              onClose();
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

function TraderPresetForm({
  defaultValue,
  surface,
  onChange,
}: {
  defaultValue: TraderPreset;
  surface: number;
  onChange: (newValue: TraderPreset) => void;
}) {
  const [value, setValue] = useState(defaultValue);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(() => {
    onChange(value);
  }, [value]);

  return (
    <div className="my-3">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-white/70 text-xs">Slippage</span>
        <Input
          className="w-1/3"
          onChange={newValue =>
            setValue(prev => ({ ...prev, slippage: String(+newValue / 100) }))
          }
          onKeyDown={preventNonNumericInput}
          size="xs"
          suffixIcon="%"
          surface={surface}
          type="string"
          value={String(+value.slippage * 100)}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-white/70 text-xs">Priority Fee (SOL)</span>
        <Input
          className="w-1/3"
          onBlur={() => {
            value.sol_priority_fee === '' &&
              setValue(prev => ({
                ...prev,
                sol_priority_fee: '0',
              }));
          }}
          onChange={newValue =>
            setValue(prev => ({
              ...prev,
              sol_priority_fee: newValue,
            }))
          }
          onKeyDown={preventNonNumericInput}
          size="xs"
          surface={surface}
          type="string"
          value={value.sol_priority_fee}
        />
      </div>
    </div>
  );
}
