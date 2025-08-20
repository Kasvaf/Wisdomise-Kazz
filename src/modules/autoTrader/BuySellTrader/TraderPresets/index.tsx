import { clsx } from 'clsx';
import { bxChevronDown, bxCog } from 'boxicons-quasar';
import { useEffect, useState } from 'react';
import { Button, type ButtonSize } from 'shared/v1-components/Button';
import Icon from 'shared/Icon';
import { type Surface } from 'utils/useSurface';
import { Dialog } from 'shared/v1-components/Dialog';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { Input } from 'shared/v1-components/Input';
import { preventNonNumericInput } from 'utils/numbers';
import {
  type QuickBuySource,
  type TraderPreset,
  type TraderPresets,
  useUserSettings,
} from 'modules/base/auth/UserSettingsProvider';
import { HoverTooltip } from 'shared/HoverTooltip';
import useDialog from 'shared/useDialog';
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
        <TraderPresetsSelector surface={1} source="terminal" />
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
                key={m}
                mode={m}
                className="mt-2"
                showMode={!mode}
              />

              <Icon
                name={bxChevronDown}
                size={20}
                className={clsx(
                  visibleForms[index]
                    ? 'rotate-180 transition-transform'
                    : 'text-white/70 transition-transform',
                  'text-white/70',
                )}
              />
            </button>
            <div className={visibleForms[index] ? '' : 'hidden'}>
              <TraderPresetForm
                key={String(activeIndex) + m}
                surface={1}
                defaultValue={presets[activeIndex][m]}
                onChange={newValue => {
                  updatePresetPartial(activeIndex, m, newValue);
                }}
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
  source: QuickBuySource;
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
            variant="ghost"
            size={size}
            className={clsx(index !== activeIndex && '!bg-transparent')}
            onClick={() => {
              if (index === activeIndex) {
                void open({});
              } else {
                updateQuickBuyActivePreset(source, index);
              }
            }}
            surface={surface}
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
}: {
  mode: 'buy' | 'sell';
  className?: string;
  showMode?: boolean;
  presetIndex?: number;
  source?: QuickBuySource;
}) {
  const { settings, getActivePreset } = useUserSettings();
  const activePreset = (
    presetIndex === undefined
      ? getActivePreset(source)
      : settings.presets[presetIndex]
  )[mode];

  return (
    <div
      className={clsx(
        'flex items-center gap-1 text-xs text-white/70',
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
      <div className="border-v1-surface-l3 mx-1 h-3 border-r" />
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(() => {
    if (settings) {
      setPresets([...settings.presets]);
    }
  }, [open, settings]);

  return presets ? (
    <Dialog open={open} mode="modal" contentClassName="p-7" onClose={onResolve}>
      <div className="w-96">
        <h1 className="mb-8 text-2xl font-medium">Quick Settings</h1>
        <p className="mb-3 text-xs">Presets</p>
        <ButtonSelect
          variant="white"
          className="mb-3"
          size="md"
          surface={2}
          value={currentPreset}
          options={
            settings.presets?.map((_, index) => ({
              value: index,
              label: `P${index + 1}`,
            })) ?? []
          }
          onChange={setCurrentPreset}
        />
        <ButtonSelect
          value={currentMode}
          className="mb-6"
          size="md"
          surface={2}
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
          onChange={setCurrentMode}
        />
        <TraderPresetForm
          key={currentMode + String(currentPreset)}
          defaultValue={presets[currentPreset][currentMode]}
          surface={2}
          onChange={newValue => {
            setPresets(prev => {
              const newPresets = [...(prev ?? [])];
              newPresets[currentPreset][currentMode] = newValue;
              return newPresets;
            });
          }}
        />

        <div className="mt-6 flex items-center justify-between gap-2">
          <Button className="w-full" variant="outline" onClick={onResolve}>
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
        <span className="text-xs text-white/70">Slippage</span>
        <Input
          surface={surface}
          size="xs"
          type="string"
          value={String(+value.slippage * 100)}
          suffixIcon="%"
          className="w-1/3"
          onChange={newValue =>
            setValue(prev => ({ ...prev, slippage: String(+newValue / 100) }))
          }
          onKeyDown={preventNonNumericInput}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/70">Priority Fee (SOL)</span>
        <Input
          surface={surface}
          size="xs"
          type="string"
          value={value.sol_priority_fee}
          className="w-1/3"
          onChange={newValue =>
            setValue(prev => ({
              ...prev,
              sol_priority_fee: newValue,
            }))
          }
          onBlur={() => {
            value.sol_priority_fee === '' &&
              setValue(prev => ({
                ...prev,
                sol_priority_fee: '0',
              }));
          }}
          onKeyDown={preventNonNumericInput}
        />
      </div>
    </div>
  );
}

export function BtnTraderPresetsSettings() {
  const [dialog, open] = useDialog(TraderPresetSettingsDialog);

  return (
    <Button
      size="2xs"
      variant="ghost"
      className="!bg-transparent !px-0 text-white/70"
      onClick={() => {
        void open({});
      }}
    >
      <Icon name={bxCog} />

      {dialog}
    </Button>
  );
}
