import { clsx } from 'clsx';
import { type ReactNode, useEffect, useState } from 'react';
import { bxCheck, bxEditAlt } from 'boxicons-quasar';
import { Button } from 'shared/v1-components/Button';
import { type Surface } from 'utils/useSurface';
import { preventNonNumericInput } from 'utils/numbers';
import Icon from 'shared/Icon';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import SensibleSteps from 'modules/base/wallet/SensibleSteps';

export default function QuoteQuickSet({
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
  children,
  sensible,
}: {
  token?: string;
  balance?: number | null;
  value?: string;
  mode?: 'buy' | 'sell' | 'sell_percentage';
  onClick: (value: string) => void;
  surface?: Surface;
  className?: string;
  btnClassName?: string;
  enableEdit?: boolean;
  hasEditBtn?: boolean;
  quote: string;
  showAll?: boolean;
  children?: ReactNode;
  sensible?: boolean;
}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const { settings, updateQuotesQuickSet } = useUserSettings();
  const preset = settings.quotes_quick_set[mode ?? 'buy'];
  const presetOptions = preset?.[quote];

  useEffect(() => {
    if (enableEdit !== undefined) {
      setIsEditMode(enableEdit);
    }
  }, [enableEdit]);

  return (
    <div className={clsx('flex gap-1', className)}>
      {sensible ? (
        <SensibleSteps
          className="grow"
          balance={balance}
          onChange={newAmount => onClick(newAmount)}
        />
      ) : (
        <div className="grid grow grid-cols-4 gap-1">
          {presetOptions
            ?.filter((_, index) => showAll || index < 4)
            .map((value, index) => (
              <Button
                key={index}
                size="2xs"
                variant="ghost"
                className={clsx(
                  btnClassName,
                  isEditMode &&
                    '!border-v1-border-brand !bg-v1-background-brand/10',
                )}
                onClick={() => {
                  if (!isEditMode) {
                    onClick(value);
                  }
                }}
                surface={surface}
              >
                {isEditMode ? (
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={value}
                    className="w-full bg-transparent text-center outline-none"
                    onKeyDown={preventNonNumericInput}
                    onChange={e => {
                      if (quote && mode) {
                        updateQuotesQuickSet(
                          quote,
                          mode,
                          index,
                          e.target.value,
                        );
                      }
                    }}
                  />
                ) : (
                  value
                )}
                {mode === 'sell_percentage' && !isEditMode && '%'}
              </Button>
            ))}
        </div>
      )}
      {children}
      {hasEditBtn && (
        <Button
          surface={surface}
          variant="ghost"
          size="2xs"
          className="shrink-0"
          fab
          disabled={sensible}
          onClick={() => {
            setIsEditMode(prev => !prev);
          }}
        >
          <Icon
            name={isEditMode ? bxCheck : bxEditAlt}
            className="[&>svg]:!size-4"
          />
        </Button>
      )}
    </div>
  );
}
