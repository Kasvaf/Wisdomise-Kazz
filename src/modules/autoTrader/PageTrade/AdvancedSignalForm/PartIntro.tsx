/* eslint-disable import/max-dependencies */
import { bxPlusCircle } from 'boxicons-quasar';
import { useMemo } from 'react';
import { useSymbolInfo } from 'api/symbol';
import { useAccountBalance } from 'api/chains';
import AmountInputBox from 'shared/AmountInputBox';
import Icon from 'shared/Icon';
import Spin from 'shared/Spin';
import { Button } from 'shared/v1-components/Button';
import { useActiveNetwork } from 'modules/base/active-network';
import { type SignalFormState } from './useSignalFormStates';
import QuoteSelector from './QuoteSelector';
import AIPresets from './AIPressets';

const rounder = (val: number) => {
  if (val < 10) {
    return val
      .toFixed(val > -1 && val < 1 ? 18 : 2)
      .replace(/(\.0*\d{2})\d*/, '$1')
      .replaceAll(/\.?0+$/g, '');
  } else if (val < 100) {
    return Math.round(val);
  } else {
    return Math.round(val / 10) * 10;
  }
};

const PartIntro: React.FC<{
  data: SignalFormState;
  baseSlug: string;
  noManualPreset?: boolean;
}> = ({ data, baseSlug, noManualPreset }) => {
  const {
    isUpdate: [isUpdate],
    amount: [amount, setAmount],
    quote: [quote, setQuote],
  } = data;

  const { data: quoteInfo } = useSymbolInfo(quote);
  const net = useActiveNetwork();
  const isNativeQuote =
    (net === 'the-open-network' && quote === 'the-open-network') ||
    (net === 'solana' && quote === 'wrapped-solana');

  const { data: quoteBalance, isLoading: balanceLoading } =
    useAccountBalance(quote);

  const { data: quoteSymbol } = useSymbolInfo(quote);
  const abr = quoteSymbol?.abbreviation;

  const steps = useMemo(() => {
    if (!quoteBalance || !abr) return [];
    return [0.1, 0.25, 0.5, 0.75, 1].map(p => {
      const value = String(rounder(p * quoteBalance));
      return {
        value,
        label: p === 1 ? 'MAX' : String(value) + ' ' + abr,
      };
    });
  }, [quoteBalance, abr]);

  return (
    <div>
      <AmountInputBox
        label={
          <div className="flex items-center justify-between">
            <span>Amount</span>
            {balanceLoading ? (
              <div className="flex items-center text-sm text-v1-content-secondary">
                <Spin />
                Reading Balance
              </div>
            ) : (
              quoteBalance != null && (
                <div
                  className="flex items-center gap-1"
                  onClick={() =>
                    !isUpdate &&
                    !isNativeQuote &&
                    setAmount(String(quoteBalance))
                  }
                >
                  {quoteBalance ? (
                    <>
                      <span className="text-sm text-white/40">
                        Balance: {String(quoteBalance)}{' '}
                        {quoteInfo?.abbreviation}
                      </span>
                      {!isUpdate && !isNativeQuote && (
                        <Icon name={bxPlusCircle} size={16} />
                      )}
                    </>
                  ) : (
                    <span className="text-sm text-v1-content-negative">
                      No Balance
                    </span>
                  )}
                </div>
              )
            )}
          </div>
        }
        max={quoteBalance || 0}
        value={amount}
        onChange={setAmount}
        noSuffixPad
        suffix={
          <QuoteSelector
            baseSlug={baseSlug}
            value={quote}
            onChange={setQuote}
            disabled={isUpdate}
          />
        }
        className="mb-3"
        disabled={isUpdate || balanceLoading || !quoteBalance}
      />

      {Boolean(quoteBalance) && (
        <div className="mb-3 flex gap-1.5">
          {steps.map(({ label, value }) => (
            <Button
              key={value}
              size="xs"
              variant={value === amount ? 'primary' : 'outline'}
              className="grow !px-2 enabled:hover:!bg-v1-background-brand enabled:active:!bg-v1-background-brand"
              onClick={() => setAmount(value)}
            >
              {label}
            </Button>
          ))}
        </div>
      )}

      <AIPresets
        data={data}
        baseSlug={baseSlug}
        quoteSlug={quote}
        noManual={noManualPreset}
      />
    </div>
  );
};

export default PartIntro;
