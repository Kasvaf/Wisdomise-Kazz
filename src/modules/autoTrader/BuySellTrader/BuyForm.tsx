import QuoteQuickSet from 'modules/autoTrader/BuySellTrader/QuoteQuickSet';
import { TraderPresetsSettings } from 'modules/autoTrader/BuySellTrader/TraderPresets';
import AmountInputBox from 'shared/AmountInputBox';
import AmountBalanceLabel from '../PageTrade/AdvancedSignalForm/AmountBalanceLabel';
import QuoteSelector from '../PageTrade/AdvancedSignalForm/QuoteSelector';
import BtnBuySell from './BtnBuySell';
import MarketField from './MarketField';
import type { SwapState } from './useSwapState';

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
        className="mb-2"
        disabled={balanceLoading || !balance}
        label={<AmountBalanceLabel setAmount={setAmount} slug={quoteSlug} />}
        max={balance || 0}
        noSuffixPad
        onChange={setAmount}
        suffix={
          baseSlug &&
          quoteSlug && (
            <QuoteSelector
              baseSlug={baseSlug}
              onChange={setQuote}
              value={quoteSlug}
            />
          )
        }
        value={amount}
      />

      <QuoteQuickSet
        className="mb-5"
        mode={dir}
        onClick={newAmount => setAmount(newAmount)}
        quote={quoteSlug}
        value={amount}
      />

      <MarketField state={state} />

      <TraderPresetsSettings mode={dir} />
      <BtnBuySell className="mt-6 w-full" state={state} />
    </div>
  );
};

export default BuyForm;
