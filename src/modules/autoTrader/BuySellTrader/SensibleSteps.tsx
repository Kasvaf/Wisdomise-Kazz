import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import { bxCheck, bxEditAlt } from 'boxicons-quasar';
import { Button } from 'shared/v1-components/Button';
import { type Surface } from 'utils/useSurface';
import { roundSensible } from 'utils/numbers';
import { useQuotesPresetAmount } from 'modules/autoTrader/BuySellTrader/BtnInstantTrade/PresetAmountProvider';
import { type AutoTraderSupportedQuotes } from 'api/chains';
import Icon from 'shared/Icon';

export default function SensibleSteps({
  balance,
  onClick,
  surface = 2,
  className,
  btnClassName,
  mode,
  enableEdit,
  hasEditBtn = true,
  quote,
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
  quote?: string;
}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const { presets, update } = useQuotesPresetAmount();
  const preset = mode === 'buy' ? presets?.buy : presets?.sellPercentage;
  const presetOptions = preset?.[quote as AutoTraderSupportedQuotes]?.map(
    v => ({
      value:
        mode === 'sell'
          ? v === '100'
            ? String(balance)
            : roundSensible((+v / 100) * (balance ?? 0))
          : String(v),
      label: v,
    }),
  );

  useEffect(() => {
    if (enableEdit !== undefined) {
      setIsEditMode(enableEdit);
    }
  }, [enableEdit]);

  return (
    <div className={clsx('flex gap-1.5', className)}>
      {presetOptions
        ?.filter((_, index) => index < 4)
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
                value={label}
                className="w-full bg-transparent text-center outline-none"
                onChange={e => {
                  if (quote && mode) {
                    update(
                      quote as AutoTraderSupportedQuotes,
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
      {hasEditBtn && (
        <Button
          surface={surface}
          variant="ghost"
          size="2xs"
          className="!px-1"
          onClick={() => setIsEditMode(prev => !prev)}
        >
          <Icon name={isEditMode ? bxCheck : bxEditAlt} />
        </Button>
      )}
    </div>
  );
}
