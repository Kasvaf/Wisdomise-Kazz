import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import { bxCheck, bxEditAlt } from 'boxicons-quasar';
import { Button } from 'shared/v1-components/Button';
import { type Surface } from 'utils/useSurface';
import { roundSensible } from 'utils/numbers';
import { useTraderSettings } from 'modules/autoTrader/BuySellTrader/TraderSettingsProvider';
import Icon from 'shared/Icon';

export default function QuoteAmountPresets({
  balance,
  onClick,
  surface = 2,
  className,
  btnClassName,
  mode,
  enableEdit,
  hasEditBtn = true,
  quote,
  showAll,
}: {
  token?: string;
  balance?: number | null;
  value?: string;
  mode?: 'buy' | 'sell';
  onClick: (value: string) => void;
  surface?: Surface;
  className?: string;
  btnClassName?: string;
  enableEdit?: boolean;
  hasEditBtn?: boolean;
  quote: string;
  showAll?: boolean;
}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const {
    quotesAmountPresets: { value: items, update, persist },
  } = useTraderSettings();
  const preset = mode === 'buy' ? items.buy : items.sellPercentage;
  const presetOptions = preset?.[quote]?.map(v => ({
    value:
      mode === 'sell'
        ? v === '100'
          ? String(balance)
          : roundSensible((+v / 100) * (balance ?? 0))
        : v,
    label: v,
  }));

  useEffect(() => {
    if (enableEdit !== undefined) {
      setIsEditMode(enableEdit);
    }
  }, [enableEdit]);

  return (
    <div className="flex gap-1.5">
      <div className={clsx('grid grow grid-cols-4 gap-1.5', className)}>
        {presetOptions
          ?.filter((_, index) => showAll || index < 4)
          .map(({ label, value: stepValue }, index) => (
            <Button
              key={index}
              size="2xs"
              variant="ghost"
              className={clsx(
                'w-full',
                btnClassName,
                isEditMode &&
                  '!border-v1-border-brand !bg-v1-background-brand/10',
              )}
              onClick={() => {
                if (!isEditMode) {
                  onClick(stepValue);
                }
              }}
              surface={surface}
            >
              {isEditMode ? (
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={label}
                  className="w-full bg-transparent text-center outline-none"
                  onKeyDown={e => {
                    if (
                      Number.isNaN(+e.key) &&
                      e.key !== 'Backspace' &&
                      e.key !== '.'
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onChange={e => {
                    if (quote && mode) {
                      update(
                        quote,
                        mode === 'sell' ? 'sellPercentage' : mode,
                        index,
                        e.target.value,
                      );
                    }
                  }}
                />
              ) : (
                label
              )}
              {mode === 'sell' && !isEditMode && '%'}
            </Button>
          ))}
      </div>
      {hasEditBtn && (
        <Button
          surface={surface}
          variant="ghost"
          size="2xs"
          className="!px-1"
          onClick={() => {
            setIsEditMode(prev => !prev);
            persist();
          }}
        >
          <Icon name={isEditMode ? bxCheck : bxEditAlt} />
        </Button>
      )}
    </div>
  );
}
