import { clsx } from 'clsx';
import { bxChevronDown, bxCog } from 'boxicons-quasar';
import { useEffect, useState } from 'react';
import {
  type TraderPreset,
  useTraderSettings,
} from 'modules/autoTrader/BuySellTrader/TraderSettingsProvider';
import { Button } from 'shared/v1-components/Button';
import Icon from 'shared/Icon';
import { type Surface } from 'utils/useSurface';
import { Dialog } from 'shared/v1-components/Dialog';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { Input } from 'shared/v1-components/Input';
import { preventNonNumericInput } from 'utils/numbers';
import { ReactComponent as PriorityIcon } from './priority.svg';
import { ReactComponent as SlippageIcon } from './slippage.svg';

export function TraderPresets({ mode }: { mode?: 'buy' | 'sell' }) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    traderPresets: { value, activeIndex, update },
  } = useTraderSettings();
  const [visibleForms, setVisibleForms] = useState<boolean[]>(
    Array.from<boolean>({ length: 2 }).fill(false),
  );

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between">
        <TraderPresetsSelector surface={2} />
        <Button
          size="2xs"
          variant="ghost"
          className="!bg-transparent !px-0 text-white/70"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <Icon name={bxCog} />
        </Button>
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
                surface={2}
                defaultValue={value[activeIndex][m]}
                onChange={newValue => {
                  update(activeIndex, m, newValue);
                }}
              />
            </div>
          </div>
        ))}
      <TraderPresetSettingsDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        activeMode={mode}
      />
    </div>
  );
}

export function TraderPresetsSelector({ surface }: { surface?: Surface }) {
  const {
    traderPresets: { activeIndex, setActive, value },
  } = useTraderSettings();

  return (
    <div className="flex items-center">
      {value?.map((_, index) => (
        <Button
          key={index}
          variant="ghost"
          size="2xs"
          className={clsx(index !== activeIndex && '!bg-transparent')}
          onClick={() => setActive(index)}
          surface={surface}
        >
          P{index + 1}
        </Button>
      ))}
    </div>
  );
}

export function TraderPresetValues({
  mode,
  className,
  showMode,
}: {
  mode: 'buy' | 'sell';
  className?: string;
  showMode?: boolean;
}) {
  const { traderPresets } = useTraderSettings();
  const activePreset = traderPresets.activePreset[mode ?? 'buy'];

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
      <span>{activePreset.slippage}%</span>
      <div className="mx-1 h-3 border-r border-v1-surface-l4" />
      <PriorityIcon />
      <span>{activePreset.priorityFee['wrapped-solana']}</span>
    </div>
  );
}

function TraderPresetSettingsDialog({
  isOpen,
  onClose,
  activeMode,
}: {
  isOpen: boolean;
  onClose: () => void;
  activeMode?: 'buy' | 'sell';
}) {
  const {
    traderPresets: { value, activeIndex, updateAll },
  } = useTraderSettings();
  const [presets, setPresets] = useState([...value]);
  const [currentPreset, setCurrentPreset] = useState(activeIndex);
  const [currentMode, setCurrentMode] = useState<'buy' | 'sell'>(
    activeMode ?? 'buy',
  );

  useEffect(() => {
    setPresets([...value]);
  }, [isOpen, value]);

  useEffect(() => {
    setCurrentPreset(activeIndex ?? 0);
  }, [activeIndex]);

  useEffect(() => {
    if (activeMode) {
      setCurrentMode(activeMode);
    }
  }, [activeMode]);

  return (
    <Dialog open={isOpen} mode="modal" contentClassName="p-7" onClose={onClose}>
      <div className="w-96">
        <h1 className="mb-8 text-2xl font-medium">Quick Settings</h1>
        <p className="mb-3 text-xs">Presets</p>
        <ButtonSelect
          variant="white"
          className="mb-3"
          size="md"
          surface={4}
          value={currentPreset}
          options={
            value?.map((_, index) => ({
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
          surface={4}
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
          surface={4}
          onChange={newValue => {
            setPresets(prev => {
              const newPresets = [...prev];
              newPresets[currentPreset][currentMode] = newValue;
              return newPresets;
            });
          }}
        />

        <div className="mt-6 flex items-center justify-between gap-2">
          <Button className="w-full" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="w-full"
            onClick={() => {
              updateAll(presets);
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
  surface: Surface;
  onChange: (newValue: TraderPreset) => void;
}) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    onChange(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="my-3">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-white/70">Slippage</span>
        <Input
          surface={surface}
          size="xs"
          type="string"
          value={value.slippage}
          suffixIcon="%"
          className="w-1/3"
          onChange={newValue =>
            setValue(prev => ({ ...prev, slippage: newValue }))
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
          value={value.priorityFee['wrapped-solana']}
          className="w-1/3"
          onChange={newValue =>
            setValue(prev => ({
              ...prev,
              priorityFee: { 'wrapped-solana': newValue },
            }))
          }
          onKeyDown={preventNonNumericInput}
        />
      </div>
    </div>
  );
}
