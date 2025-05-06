import { roundSensible } from 'utils/numbers';
import AmountInputBox from 'shared/AmountInputBox';
import { Button } from 'shared/v1-components/Button';
import QuoteSelector from '../PageTrade/AdvancedSignalForm/QuoteSelector';
import AmountBalanceLabel from '../PageTrade/AdvancedSignalForm/AmountBalanceLabel';
import { type SwapState } from './useSwapState';
import MarketField from './MarketField';
import BtnBuySell from './BtnBuySell';

const SellForm: React.FC<{ state: SwapState }> = ({ state }) => {
  const {
    baseFields: {
      balance: baseBalance,
      amount,
      setAmount,
      balanceLoading,
      priceByOther,
    },
    isMarketPrice,
    quoteFields,
    quote,
    setQuote,
    base,
  } = state;

  const targetReady = priceByOther !== undefined;
  const marketToAmount = +amount * Number(priceByOther);

  const steps =
    baseBalance &&
    [0.25, 0.5, 0.75, 1].map(p => ({
      label: `${p * 100}%`,
      value: roundSensible(p * baseBalance),
    }));

  return (
    <div>
      <AmountInputBox
        max={baseBalance || 0}
        value={amount}
        onChange={setAmount}
        noSuffixPad
        label={<AmountBalanceLabel slug={base} setAmount={setAmount} />}
        className="mb-2"
        disabled={balanceLoading || !baseBalance}
      />

      {!!steps && (
        <div className="mb-3 flex gap-1.5">
          {steps.map(({ label, value }) => (
            <Button
              key={value}
              size="xs"
              variant={value === amount ? 'primary' : 'ghost'}
              className="!h-6 grow !px-2 enabled:hover:!bg-v1-background-brand enabled:active:!bg-v1-background-brand"
              onClick={() => setAmount(value)}
              surface={2}
            >
              {label}
            </Button>
          ))}
        </div>
      )}

      <AmountInputBox
        disabled={isMarketPrice}
        value={
          isMarketPrice
            ? targetReady
              ? roundSensible(marketToAmount)
              : '...'
            : quoteFields.amount
        }
        onChange={quoteFields.setAmount}
        suffix={
          base &&
          quote && (
            <QuoteSelector baseSlug={base} value={quote} onChange={setQuote} />
          )
        }
        className="mb-3"
      />
      <MarketField state={state} />
      <BtnBuySell state={state} className="mt-6 w-full" />
    </div>
  );
};

export default SellForm;
