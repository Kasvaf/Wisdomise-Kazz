import AmountInputBox from 'shared/AmountInputBox';
import QuoteAmountPresets from 'modules/autoTrader/BuySellTrader/QuoteAmountPresets';
import QuoteSelector from '../PageTrade/AdvancedSignalForm/QuoteSelector';
import AmountBalanceLabel from '../PageTrade/AdvancedSignalForm/AmountBalanceLabel';
import { type SwapState } from './useSwapState';
import MarketField from './MarketField';
import BtnBuySell from './BtnBuySell';
import { TraderPresets } from 'modules/autoTrader/BuySellTrader/TraderPresets';

const BuyForm: React.FC<{ state: SwapState }> = ({ state }) => {
  const {
    quote: {
      slug: quoteSlug,
      setSlug: setQuote,
      balance,
      amount,
      balanceLoading,
    },
    setAmount,
    base: { slug: baseSlug },
    dir,
  } = state;

  return (
    <div>
      <AmountInputBox
        max={balance || 0}
        value={amount}
        onChange={setAmount}
        noSuffixPad
        suffix={
          baseSlug &&
          quoteSlug && (
            <QuoteSelector
              baseSlug={baseSlug}
              value={quoteSlug}
              onChange={setQuote}
            />
          )
        }
        label={<AmountBalanceLabel slug={quoteSlug} setAmount={setAmount} />}
        className="mb-2"
        disabled={balanceLoading || !balance}
      />

      <QuoteAmountPresets
        className="mb-3"
        quote={quoteSlug}
        mode={dir}
        value={amount}
        onClick={newAmount => setAmount(newAmount)}
      />

      <MarketField state={state} />

      <TraderPresets mode={dir} />
      <BtnBuySell state={state} className="mt-6 w-full" />
    </div>
  );
};

export default BuyForm;
