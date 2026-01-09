import { bxCheck, bxCog, bxEditAlt, bxWallet } from 'boxicons-quasar';
import type { TraderPreset } from 'modules/autoTrader/BuySellTrader/TraderPresets';
import { convertToBaseAmount } from 'modules/autoTrader/BuySellTrader/utils';
import { useTokenActivity } from 'modules/autoTrader/TokenActivity/useWatchTokenStream';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { useModalLogin } from 'modules/base/auth/ModalLogin';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import { WalletSelector } from 'modules/base/wallet/BtnSolanaWallets';
import TotalBalance from 'modules/base/wallet/TotalBalance';
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import Icon from 'modules/shared/Icon';
import { Button } from 'modules/shared/v1-components/Button';
import { ButtonSelect } from 'modules/shared/v1-components/ButtonSelect';
import { Dialog } from 'modules/shared/v1-components/Dialog';
import { Input } from 'modules/shared/v1-components/Input';
import { useEffect, useState } from 'react';
import { useSwap, useTokenBalance } from 'services/chains';
import { WRAPPED_SOLANA_SLUG } from 'services/chains/constants';
import { useWallets } from 'services/chains/wallet';
import { WatchEventType } from 'services/grpc/proto/wealth_manager';
import { useLastPriceStream } from 'services/price';
import { useWalletsQuery } from 'services/rest/wallets';
import { preventNonNumericInput } from 'utils/numbers';
import { MobileWalletItem } from './MobileWalletItem';

export function MobileTradePanel() {
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState<number | null>(null);
  const [showPresetDrawer, setShowPresetDrawer] = useState(false);
  const [showOrderTypeDrawer, setShowOrderTypeDrawer] = useState(false);
  const [showWalletDrawer, setShowWalletDrawer] = useState(false);
  const [orderType, setOrderType] = useState<'Instant' | 'Market' | 'Limit'>(
    'Instant',
  );
  const [isEditMode, setIsEditMode] = useState(false);

  // Desktop hooks integration
  const { symbol } = useUnifiedCoinDetails();
  const slug = symbol.slug;
  const [quote, _setQuote] = useState(WRAPPED_SOLANA_SLUG);

  const { primaryWallet, selectedWallets } = useWallets();
  const { data: baseBalance } = useTokenBalance({ slug });
  const isLoggedIn = useIsLoggedIn();
  const [loginModal, open] = useModalLogin();
  useWalletsQuery();

  const { data: basePriceByQuote } = useLastPriceStream({
    slug,
    quote,
    convertToUsd: false,
  });

  const swapAsync = useSwap({ source: 'terminal', slug, quote });

  // Get initial position for Sell Initials
  const { init } = useTokenActivity({
    slug,
    type: WatchEventType.SWAP_POSITION_UPDATE,
  });

  const {
    settings: userSettings,
    updateQuickBuyActivePreset,
    updateQuotesQuickSet,
  } = useUserSettings();

  const sellAmountType = userSettings.quotes_quick_set.sell_selected_type;

  // Get quick amounts from user settings based on current mode and quote
  const normQuote = quote === WRAPPED_SOLANA_SLUG ? 'sol' : 'usd';
  const quickAmounts = userSettings.quotes_quick_set[mode]?.[normQuote] || [
    0.1, 0.2, 0.3, 0.6,
  ];

  // Execute swap with desktop logic
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

  // Sell all initial holdings instantly (no confirmation)
  const sellInitials = async () => {
    if (!isLoggedIn) {
      open();
      return;
    }
    if (init <= 0) return;
    await swapAsync('SHORT', String(init));
  };

  const activePresetIndex =
    userSettings?.quick_buy?.terminal?.active_preset ?? 0;

  const orderTypes: Array<'Instant' | 'Market' | 'Limit'> = [
    'Instant',
    'Market',
    'Limit',
  ];

  return (
    <div className="flex flex-col gap-2 border-v1-border-tertiary/30 border-t bg-v1-surface-l1/30 px-3 py-2.5">
      {/* ROW 1: PRIORITY 1 - Quick Amount Buttons (THUMB HOT ZONE) */}
      <div className="flex gap-1.5">
        {quickAmounts.slice(0, mode === 'sell' ? 3 : 4).map((amt, index) => {
          const isSelected = amount === Number(amt);
          return (
            <Button
              block
              className={`flex-1 font-mono ${
                isEditMode
                  ? '!border-v1-border-brand !bg-v1-background-brand/10 !text-v1-content-brand'
                  : isSelected
                    ? mode === 'buy'
                      ? '!text-black bg-v1-content-positive shadow-[0_0_12px_rgba(34,197,94,0.4)]'
                      : '!text-white bg-v1-content-negative shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                    : mode === 'buy'
                      ? 'border-v1-content-positive text-v1-content-positive hover:border-v1-content-positive hover:bg-v1-content-positive/10'
                      : 'border-v1-content-negative text-v1-content-negative hover:border-v1-content-negative hover:bg-v1-content-negative/10'
              }`}
              key={index}
              onClick={() => {
                if (!isEditMode) {
                  setAmount(Number(amt));
                  swap(String(amt), mode === 'buy' ? 'LONG' : 'SHORT');
                }
              }}
              size="md"
              surface={1}
              variant="outline"
            >
              {isEditMode ? (
                <input
                  className="w-full bg-transparent text-center outline-none"
                  inputMode="numeric"
                  onChange={e => {
                    updateQuotesQuickSet(
                      normQuote,
                      mode,
                      index,
                      e.target.value,
                    );
                  }}
                  onKeyDown={preventNonNumericInput}
                  pattern="[0-9]*"
                  type="text"
                  value={amt}
                />
              ) : (
                amt
              )}
            </Button>
          );
        })}

        {/* Sell Initials - Only in sell mode, replaces 4th amount button */}
        {mode === 'sell' && (
          <Button
            block
            className="flex-1 bg-v1-content-negative font-bold text-white hover:bg-v1-content-negative/90 disabled:opacity-50"
            disabled={init <= 0}
            onClick={sellInitials}
            size="md"
            surface={1}
          >
            Sell Init
          </Button>
        )}
      </div>

      {/* ROW 2: PRIORITY 2/3/4 - Wallet + Preset + Edit + Buy/Sell Toggle */}
      <div className="flex items-center gap-2">
        {/* Wallet Button - Priority 3 */}
        <Button
          className="flex-1 justify-start gap-2"
          onClick={() => setShowWalletDrawer(true)}
          size="sm"
          surface={1}
          variant="ghost"
        >
          <Icon name={bxWallet} size={14} />
          <span className="truncate text-sm">
            {selectedWallets.length > 1
              ? `${selectedWallets.length} Wallets`
              : primaryWallet?.name || 'Wallet'}
          </span>
          <span className="ml-auto font-mono text-neutral-500 text-xs">
            {baseBalance?.toFixed(2) ?? '0.00'}
          </span>
        </Button>

        {/* Preset Selector - Priority 4 */}
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

        {/* Edit Button */}
        <Button
          className="text-neutral-600 hover:text-white"
          fab={true}
          onClick={() => setIsEditMode(prev => !prev)}
          size="3xs"
          title={isEditMode ? 'Save Changes' : 'Edit Quick Amounts'}
          variant="ghost"
        >
          <Icon name={isEditMode ? bxCheck : bxEditAlt} size={12} />
        </Button>

        {/* Buy/Sell Toggle - Priority 2 */}
        <ButtonSelect
          buttonClassName="px-4 font-bold"
          onChange={newMode => setMode(newMode)}
          options={[
            {
              value: 'buy' as const,
              label: 'Buy',
              className:
                mode === 'buy' ? 'bg-v1-content-positive !text-black' : '',
            },
            {
              value: 'sell' as const,
              label: 'Sell',
              className:
                mode === 'sell' ? '!bg-v1-content-negative !text-white' : '',
            },
          ]}
          size="md"
          surface={1}
          value={mode}
        />
      </div>

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

      {/* Wallet Selection Drawer - Multi-wallet support */}
      <Dialog
        className="bg-v1-surface-l1"
        contentClassName="flex flex-col max-h-[70vh] overflow-y-auto p-4"
        drawerConfig={{ position: 'bottom', closeButton: true }}
        header={
          <div className="flex w-full items-center justify-between px-4 pt-4">
            <span className="font-medium text-lg text-white">Wallets</span>
          </div>
        }
        mode="drawer"
        onClose={() => setShowWalletDrawer(false)}
        open={showWalletDrawer}
      >
        <TotalBalance className="mb-4 rounded-lg bg-v1-surface-l2 p-3" />
        <WalletSelector WalletOptionComponent={MobileWalletItem} />
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
