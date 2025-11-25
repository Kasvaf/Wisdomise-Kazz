import { bxCheck, bxEditAlt } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import SensibleSteps from 'modules/base/wallet/SensibleSteps';
import { type ReactNode, useEffect, useState } from 'react';
import { WRAPPED_SOLANA_SLUG } from 'services/chains/constants';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import { preventNonNumericInput } from 'utils/numbers';
import type { Surface } from 'utils/useSurface';

export default function QuoteQuickSet({
  balance,
  onClick,
  surface = 1,
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
  const normQuote = quote === WRAPPED_SOLANA_SLUG ? 'sol' : 'usd';
  const presetOptions = preset?.[normQuote];

  useEffect(() => {
    if (enableEdit !== undefined) {
      setIsEditMode(enableEdit);
    }
  }, [enableEdit]);

  return (
    <div className={clsx('flex gap-1', className)}>
      {sensible ? (
        <SensibleSteps
          balance={balance}
          className="grow"
          onChange={newAmount => onClick(newAmount)}
        />
      ) : (
        <div className="grid grow grid-cols-4 gap-1">
          {presetOptions
            ?.filter((_, index) => showAll || index < 4)
            .map((value, index) => (
              <Button
                className={clsx(
                  btnClassName,
                  isEditMode &&
                    '!border-v1-border-brand !bg-v1-background-brand/10',
                )}
                key={index}
                onClick={() => {
                  if (!isEditMode) {
                    onClick(value);
                  }
                }}
                size="2xs"
                surface={surface}
                variant="ghost"
              >
                {isEditMode ? (
                  <input
                    className="w-full bg-transparent text-center outline-none"
                    inputMode="numeric"
                    onChange={e => {
                      if (normQuote && mode) {
                        updateQuotesQuickSet(
                          normQuote,
                          mode,
                          index,
                          e.target.value,
                        );
                      }
                    }}
                    onKeyDown={preventNonNumericInput}
                    pattern="[0-9]*"
                    type="text"
                    value={value}
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
          className="shrink-0"
          disabled={sensible}
          fab
          onClick={() => {
            setIsEditMode(prev => !prev);
          }}
          size="2xs"
          surface={surface}
          variant="ghost"
        >
          <Icon
            className="[&>svg]:!size-4"
            name={isEditMode ? bxCheck : bxEditAlt}
          />
        </Button>
      )}
    </div>
  );
}
