import AmountInputBox from 'shared/AmountInputBox';
import { Button } from 'shared/v1-components/Button';
import QuoteSelector from '../PageTrade/AdvancedSignalForm/QuoteSelector';
import useSensibleSteps from '../PageTrade/AdvancedSignalForm/useSensibleSteps';
import AmountBalanceLabel from '../PageTrade/AdvancedSignalForm/AmountBalanceLabel';
import { type SwapState } from './useSwapState';
import MarketField from './MarketField';
import BtnBuySell from './BtnBuySell';

const BuyForm: React.FC<{ state: SwapState }> = ({ state }) => {
  const {
    quoteFields: { balance: quoteBalance, amount, setAmount, balanceLoading },
    quote,
    setQuote,
    base,
  } = state;

  const steps = useSensibleSteps(quoteBalance);

  return (
    <div>
      <AmountInputBox
        max={quoteBalance || 0}
        value={amount}
        onChange={setAmount}
        noSuffixPad
        suffix={
          base &&
          quote && (
            <QuoteSelector baseSlug={base} value={quote} onChange={setQuote} />
          )
        }
        label={<AmountBalanceLabel slug={quote} setAmount={setAmount} />}
        className="mb-2"
        disabled={balanceLoading || !quoteBalance}
      />

      {Boolean(quoteBalance) && (
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

      <MarketField state={state} />
      <BtnBuySell state={state} className="mt-6 w-full" />
    </div>
  );
};

export default BuyForm;
