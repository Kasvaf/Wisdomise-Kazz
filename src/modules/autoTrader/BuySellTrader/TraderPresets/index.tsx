import { bxChevronDown, bxCog } from 'boxicons-quasar';
import { clsx } from 'clsx';
import {
  type TraderPreset,
  type TraderPresets,
  type TradeSettingsSource,
  useUserSettings,
} from 'modules/base/auth/UserSettingsProvider';
import { useEffect, useState } from 'react';
import { HoverTooltip } from 'shared/HoverTooltip';
import Icon from 'shared/Icon';
import useDialog from 'shared/useDialog';
import { Button, type ButtonSize } from 'shared/v1-components/Button';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { Dialog } from 'shared/v1-components/Dialog';
import { Input } from 'shared/v1-components/Input';
import { preventNonNumericInput } from 'utils/numbers';
import useIsMobile from 'utils/useIsMobile';
import type { Surface } from 'utils/useSurface';
import { ReactComponent as PriorityIcon } from './priority.svg';
import { ReactComponent as SlippageIcon } from './slippage.svg';

export function TraderPresetsSettings({ mode }: { mode?: 'buy' | 'sell' }) {
  const [visibleForms, setVisibleForms] = useState<boolean[]>(
    Array.from<boolean>({ length: 2 }).fill(false),
  );
  const { settings, updatePresetPartial } = useUserSettings();

  const activeIndex = settings.quick_buy.terminal.active_preset;
  const presets = settings.presets;

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between">
        <TraderPresetsSelector source="terminal" surface={1} />
        <BtnTraderPresetsSettings />
      </div>
      {(['buy', 'sell'] as const)
        .filter(m => mode === undefined || mode === m)
        .map((m, index) => (
          <div key={m}>
            <button
              className="flex w-full items-center justify-between"
              onClick={() => {
                setVisibleForms(prev => {
                  const copy = [...prev];
                  copy[index] = !copy[index];
                  return copy;
                });
              }}
            >
              <TraderPresetValues
                className="mt-2"
                key={m}
                mode={m}
                showMode={!mode}
              />

              <Icon
                className={clsx(
                  visibleForms[index]
                    ? 'rotate-180 transition-transform'
                    : 'text-white/70 transition-transform',
                  'text-white/70',
                )}
                name={bxChevronDown}
                size={20}
              />
            </button>
            <div className={visibleForms[index] ? '' : 'hidden'}>
              <TraderPresetForm
                defaultValue={presets[activeIndex][m]}
                key={String(activeIndex) + m}
                onChange={newValue => {
                  updatePresetPartial(activeIndex, m, newValue);
                }}
                surface={1}
              />
            </div>
          </div>
        ))}
    </div>
  );
}

export function TraderPresetsSelector({
  surface,
  source,
  size = '2xs',
  showValue,
}: {
  surface?: Surface;
  source: TradeSettingsSource;
  size?: ButtonSize;
  showValue?: boolean;
}) {
  const { settings, updateQuickBuyActivePreset } = useUserSettings();
  const [dialog, open] = useDialog(TraderPresetSettingsDialog);

  const activeIndex = settings.quick_buy[source].active_preset;

  return (
    <div className="flex items-center">
      {settings.presets?.map((_, index) => (
        <HoverTooltip
          disabled={!showValue}
          key={index}
          title={<TraderPresetValues mode="buy" presetIndex={index} />}
        >
          <Button
            className={clsx(index !== activeIndex && '!bg-transparent')}
            onClick={() => {
              if (index === activeIndex) {
                void open({});
              } else {
                updateQuickBuyActivePreset(source, index);
              }
            }}
            size={size}
            surface={surface}
            variant="ghost"
          >
            P{index + 1}
          </Button>
        </HoverTooltip>
      ))}
      {dialog}
    </div>
  );
}

export function TraderPresetValues({
  mode,
  className,
  showMode,
  presetIndex,
  source = 'terminal',
  value,
}: {
  mode?: 'buy' | 'sell';
  className?: string;
  showMode?: boolean;
  presetIndex?: number;
  source?: TradeSettingsSource;
  value?: TraderPreset;
}) {
  const { settings, getActivePreset } = useUserSettings();
  const activePreset =
    value ??
    (presetIndex === undefined
      ? getActivePreset(source)
      : settings.presets[presetIndex])[mode ?? 'buy'];

  return (
    <div
      className={clsx(
        'flex items-center gap-1 text-white/70 text-xs',
        className,
      )}
    >
      {showMode && (
        <span
          className={
            mode === 'buy'
              ? 'text-v1-content-positive'
              : 'text-v1-content-negative'
          }
        >
          {mode === 'buy' ? 'Buy' : 'Sell'}:
        </span>
      )}
      <SlippageIcon />
      <span>{+activePreset.slippage * 100}%</span>
      <div className="mx-1 h-3 border-v1-surface-l3 border-r" />
      <PriorityIcon />
      <span>{activePreset.sol_priority_fee}</span>
    </div>
  );
}

function TraderPresetSettingsDialog({
  onResolve,
  open,
}: {
  onResolve: () => void;
  open: boolean;
}) {
  const { settings, updatePreset } = useUserSettings();
  const [presets, setPresets] = useState<TraderPresets>();
  const [currentPreset, setCurrentPreset] = useState(0);
  const [currentMode, setCurrentMode] = useState<'buy' | 'sell'>('buy');
  const isMobile = useIsMobile();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(() => {
    if (settings) {
      setPresets([...settings.presets]);
    }
  }, [open, settings]);

  return presets ? (
    <Dialog
      contentClassName="p-7"
      mode={isMobile ? 'drawer' : 'modal'}
      onClose={onResolve}
      open={open}
    >
      <div className="md:w-96">
        <h1 className="mb-8 font-medium text-2xl">Quick Settings</h1>
        <p className="mb-3 text-xs">Presets</p>
        <ButtonSelect
          className="mb-3"
          onChange={setCurrentPreset}
          options={
            settings.presets?.map((_, index) => ({
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
          <Button className="w-full" onClick={onResolve} variant="outline">
            Cancel
          </Button>
          <Button
            className="w-full"
            onClick={() => {
              updatePreset(presets);
              onResolve();
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Dialog>
  ) : null;
}

function TraderPresetForm({
  defaultValue,
  surface,
  onChange,
}: {
  defaultValue: TraderPreset;
  surface: Surface;
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

export function BtnTraderPresetsSettings() {
  const [dialog, open] = useDialog(TraderPresetSettingsDialog);

  return (
    <Button
      className="!bg-transparent !px-0 text-white/70"
      onClick={() => {
        void open({});
      }}
      size="2xs"
      variant="ghost"
    >
      <Icon name={bxCog} />

      {dialog}
    </Button>
  );
}
