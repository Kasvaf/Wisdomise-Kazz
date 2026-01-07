import { bxCog, bxWallet, bxEditAlt, bxCheck } from 'boxicons-quasar';
import type { TraderPreset } from 'modules/autoTrader/BuySellTrader/TraderPresets';
import { convertToBaseAmount } from 'modules/autoTrader/BuySellTrader/utils';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { useModalLogin } from 'modules/base/auth/ModalLogin';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import Icon from 'modules/shared/Icon';
import { Dialog } from 'modules/shared/v1-components/Dialog';
import { Input } from 'modules/shared/v1-components/Input';
import { ToggleSwitcher } from 'modules/shared/v1-components/ToggleSwitcher';
import { UnifiedButton } from 'modules/shared/v1-components/UnifiedButton';
import { useEffect, useState } from 'react';
import { useSwap, useTokenBalance } from 'services/chains';
import { WRAPPED_SOLANA_SLUG } from 'services/chains/constants';
import { useCustodialWallet } from 'services/chains/wallet';
import { useLastPriceStream } from 'services/price';
import { useWalletsQuery } from 'services/rest/wallets';
import { preventNonNumericInput } from 'utils/numbers';

const SOL_PRESET_LIBRARY = [
  { category: 'Micro', values: [0.001, 0.005, 0.01, 0.05] },
  { category: 'Small', values: [0.1, 0.25, 0.5] },
  { category: 'Medium', values: [1, 2, 5] },
  { category: 'Large', values: [10, 20, 50, 100] },
];

const USD_PRESET_LIBRARY = [
  { category: 'Small', values: [0.1, 0.5, 1, 2.5] },
  { category: 'Medium', values: [5, 10, 20, 50] },
  { category: 'Large', values: [100, 200, 500, 1000] },
];

export function MobileTradePanelThumb() {
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState<number | null>(null);
  const [showPresetDrawer, setShowPresetDrawer] = useState(false);
  const [showWalletDrawer, setShowWalletDrawer] = useState(false);
  const [showAmountsDrawer, setShowAmountsDrawer] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCircleIndex, setSelectedCircleIndex] = useState<number | null>(null);
  const [showPresetPicker, setShowPresetPicker] = useState(false);

  const { symbol } = useUnifiedCoinDetails();
  const slug = symbol.slug;
  const [quote] = useState(WRAPPED_SOLANA_SLUG);

  const { data: baseBalance } = useTokenBalance({ slug });
  const isLoggedIn = useIsLoggedIn();
  const [loginModal, open] = useModalLogin();
  const { setCw } = useCustodialWallet();
  const { data: wallets } = useWalletsQuery();

  const { data: basePriceByQuote } = useLastPriceStream({
    slug,
    quote,
    convertToUsd: false,
  });

  const swapAsync = useSwap({ source: 'terminal', slug, quote });

  const {
    settings: userSettings,
    updateQuickBuyActivePreset,
    updateQuotesQuickSet,
  } = useUserSettings();

  const sellAmountType = userSettings.quotes_quick_set.sell_selected_type;
  const normQuote = quote === WRAPPED_SOLANA_SLUG ? 'sol' : 'usd';
  const quickAmounts = userSettings.quotes_quick_set[mode]?.[normQuote] || [
    0.1, 0.5, 1,
  ];

  const swap = async (amountValue: string, side: 'LONG' | 'SHORT') => {
    if (!isLoggedIn) {
      open();
      return;
    }

    let finalAmount = amountValue;
    if (side === 'SHORT') {
      finalAmount = convertToBaseAmount(
        amountValue,
        sellAmountType,
        baseBalance,
        1 / (basePriceByQuote ?? 1),
      );
    }

    await swapAsync(side, finalAmount);
  };

  const activePresetIndex =
    userSettings?.quick_buy?.terminal?.active_preset ?? 0;

  const walletBalance = baseBalance ?? 0;

  const presetLabels = ['P1', 'P2', 'P3'];

  return (
    <div className="flex flex-col gap-2 border-v1-border-tertiary/30 border-t bg-v1-surface-l1/30 px-3 py-2.5">
      {/* Row 1: PRIORITY 1 - Quick Amount Buttons (THUMB HOT ZONE) */}
      <div className="flex items-center gap-2">
        {quickAmounts.slice(0, 3).map((amt, index) => {
          const isSelected = amount === Number(amt);
          return (
            <UnifiedButton
              active={isSelected}
              className={isEditMode ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-v1-surface-l1 relative' : ''}
              key={index}
              onClick={() => {
                if (isEditMode) {
                  // Edit mode: Open preset picker for this circle
                  setSelectedCircleIndex(index);
                  setShowPresetPicker(true);
                } else {
                  // Normal mode: Execute trade
                  setAmount(Number(amt));
                  swap(String(amt), mode === 'buy' ? 'LONG' : 'SHORT');
                }
              }}
              size="circle"
              variant={mode}
            >
              <span className="text-xs">{amt}</span>
              {isEditMode && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                  <Icon name={bxEditAlt} size={8} className="text-white" />
                </div>
              )}
            </UnifiedButton>
          );
        })}

        {/* Expand More Amounts */}
        {quickAmounts.length > 3 && (
          <UnifiedButton
            onClick={() => setShowAmountsDrawer(true)}
            size="circle"
            variant="neutral"
          >
            <span className="text-[10px]">+{quickAmounts.length - 3}</span>
          </UnifiedButton>
        )}
      </div>

      {/* Row 2: PRIORITY 2/3/4 - Wallet + Preset + Mode Toggle */}
      <div className="flex items-center gap-2">
        {/* Merged Wallet Button */}
        <UnifiedButton
          className="flex-1 justify-start"
          onClick={() => setShowWalletDrawer(true)}
          variant="neutral"
        >
          <Icon name={bxWallet} size={14} />
          <span className="truncate text-[13px]">Wallet</span>
          <span className="ml-auto font-mono text-[11px] text-neutral-500">
            {walletBalance.toFixed(2)}
          </span>
        </UnifiedButton>

        {/* Preset Selector */}
        <UnifiedButton
          onClick={() => setShowPresetDrawer(true)}
          size="compact"
          variant="neutral"
        >
          {presetLabels[activePresetIndex]} ▼
        </UnifiedButton>

        {/* Edit Button */}
        <UnifiedButton
          onClick={() => setIsEditMode(!isEditMode)}
          size="icon"
          variant="neutral"
        >
          <Icon name={isEditMode ? bxCheck : bxEditAlt} size={14} />
        </UnifiedButton>

        {/* Buy/Sell Toggle Switcher */}
        <ToggleSwitcher value={mode} onChange={setMode} />
      </div>

      {/* Amounts Drawer */}
      <Dialog
        className="bg-v1-surface-l1"
        contentClassName="p-0"
        drawerConfig={{ position: 'bottom', closeButton: false }}
        mode="drawer"
        onClose={() => setShowAmountsDrawer(false)}
        open={showAmountsDrawer}
      >
        <div className="flex flex-col">
          <div className="flex items-center justify-center py-2">
            <div className="h-1 w-12 rounded-full bg-neutral-700" />
          </div>
          <div className="flex items-center justify-between border-v1-border-tertiary border-b px-4 py-3">
            <h3 className="font-semibold text-white">Quick Amounts</h3>
            <button
              className="text-blue-500 text-sm"
              onClick={() => setShowAmountsDrawer(false)}
              type="button"
            >
              Done
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3 p-4">
            {quickAmounts.map((amt, index) => {
              const isSelected = amount === Number(amt);
              return (
                <UnifiedButton
                  active={isSelected}
                  block
                  key={index}
                  onClick={() => {
                    setAmount(Number(amt));
                    swap(String(amt), mode === 'buy' ? 'LONG' : 'SHORT');
                    setShowAmountsDrawer(false);
                  }}
                  variant={mode}
                >
                  {amt}
                </UnifiedButton>
              );
            })}
          </div>
        </div>
      </Dialog>

      {/* Preset Drawer */}
      <TraderPresetSettingsDrawer
        onClose={() => setShowPresetDrawer(false)}
        open={showPresetDrawer}
      />

      {/* Wallet Drawer */}
      <Dialog
        className="bg-v1-surface-l1"
        contentClassName="flex flex-col p-4"
        drawerConfig={{ position: 'bottom', closeButton: true }}
        mode="drawer"
        onClose={() => setShowWalletDrawer(false)}
        open={showWalletDrawer}
      >
        <div className="text-center">
          <p className="mb-4 text-sm text-white">Switch to custodial wallet</p>
          <UnifiedButton
            block
            onClick={() => {
              if (wallets?.results?.[0]) {
                setCw(wallets.results[0].key);
              }
              setShowWalletDrawer(false);
            }}
            variant="neutral"
          >
            Custodial Wallet
          </UnifiedButton>
        </div>
      </Dialog>

      {/* Preset Picker Drawer */}
      <Dialog
        className="bg-v1-surface-l1"
        contentClassName="p-0"
        drawerConfig={{ position: 'bottom', closeButton: false }}
        mode="drawer"
        onClose={() => {
          setShowPresetPicker(false);
          setSelectedCircleIndex(null);
        }}
        open={showPresetPicker}
      >
        <div className="flex flex-col">
          {/* Drawer Handle */}
          <div className="flex items-center justify-center py-2">
            <div className="h-1 w-12 rounded-full bg-neutral-700" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between border-v1-border-tertiary border-b px-4 py-3">
            <div>
              <h3 className="font-semibold text-white">
                Edit Amount {selectedCircleIndex !== null ? `#${selectedCircleIndex + 1}` : ''}
              </h3>
              <p className="text-xs text-neutral-400">
                Current: {selectedCircleIndex !== null ? quickAmounts[selectedCircleIndex] : ''} {normQuote.toUpperCase()}
              </p>
            </div>
            <button
              className="text-blue-500 text-sm"
              onClick={() => {
                setShowPresetPicker(false);
                setSelectedCircleIndex(null);
              }}
              type="button"
            >
              Done
            </button>
          </div>

          {/* Categorized Presets */}
          {(normQuote === 'sol' ? SOL_PRESET_LIBRARY : USD_PRESET_LIBRARY).map(category => (
            <div key={category.category}>
              <div className="px-4 pt-4 pb-2">
                <span className="text-xs text-neutral-400">{category.category}</span>
              </div>
              <div className="grid grid-cols-3 gap-3 px-4 pb-3">
                {category.values.map((value, idx) => {
                  const currentValue = selectedCircleIndex !== null ? quickAmounts[selectedCircleIndex] : null;
                  const isCurrentValue = String(value) === String(currentValue);
                  return (
                    <UnifiedButton
                      active={isCurrentValue}
                      key={idx}
                      onClick={() => {
                        if (selectedCircleIndex !== null) {
                          updateQuotesQuickSet(normQuote, mode, selectedCircleIndex, String(value));
                          setShowPresetPicker(false);
                          setSelectedCircleIndex(null);
                        }
                      }}
                      variant={mode}
                    >
                      {value}
                    </UnifiedButton>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Dialog>
      {loginModal}
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

  useEffect(() => {
    if (settings?.presets) {
      setPresets([...settings.presets]);
    }
  }, [open, settings?.presets]);

  if (!presets || !settings?.presets) return null;

  return (
    <Dialog
      className="bg-v1-surface-l1"
      contentClassName="p-6"
      drawerConfig={{ position: 'bottom', closeButton: true }}
      mode="drawer"
      onClose={onClose}
      open={open}
    >
      <div>
        <h1 className="mb-6 font-semibold text-xl text-white">Quick Settings</h1>
        <p className="mb-2 text-xs text-neutral-400">Presets</p>
        <div className="mb-4 flex gap-2">
          {settings?.presets?.map((_, index) => (
            <UnifiedButton
              active={currentPreset === index}
              block
              key={index}
              onClick={() => setCurrentPreset(index)}
              size="compact"
              variant="neutral"
            >
              P{index + 1}
            </UnifiedButton>
          ))}
        </div>
        <div className="mb-6 flex gap-2">
          <UnifiedButton
            active={currentMode === 'buy'}
            block
            onClick={() => setCurrentMode('buy')}
            variant="buy"
          >
            Buy Settings
          </UnifiedButton>
          <UnifiedButton
            active={currentMode === 'sell'}
            block
            onClick={() => setCurrentMode('sell')}
            variant="sell"
          >
            Sell Settings
          </UnifiedButton>
        </div>
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
        />
        <div className="mt-6 flex gap-2">
          <UnifiedButton block onClick={onClose} variant="neutral">
            Cancel
          </UnifiedButton>
          <UnifiedButton
            block
            onClick={() => {
              updatePreset(presets);
              onClose();
            }}
            variant="neutral"
          >
            Save
          </UnifiedButton>
        </div>
      </div>
    </Dialog>
  );
}

function TraderPresetForm({
  defaultValue,
  onChange,
}: {
  defaultValue: TraderPreset;
  onChange: (newValue: TraderPreset) => void;
}) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    onChange(value);
  }, [value, onChange]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-400">Slippage</span>
        <Input
          className="w-24"
          onChange={newValue =>
            setValue(prev => ({ ...prev, slippage: String(+newValue / 100) }))
          }
          onKeyDown={preventNonNumericInput}
          size="xs"
          suffixIcon="%"
          surface={1}
          type="string"
          value={String(+value.slippage * 100)}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-400">Priority Fee (SOL)</span>
        <Input
          className="w-24"
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
          surface={1}
          type="string"
          value={value.sol_priority_fee}
        />
      </div>
    </div>
  );
}
