import { useEffect, useState } from 'react';
import { roundSensible } from 'utils/numbers';
import AmountInputBox from 'shared/AmountInputBox';
import SensibleSteps from 'modules/autoTrader/BuySellTrader/SensibleSteps';
import QuoteSelector from '../PageTrade/AdvancedSignalForm/QuoteSelector';
import AmountBalanceLabel from '../PageTrade/AdvancedSignalForm/AmountBalanceLabel';
import { type SwapState } from './useSwapState';
import MarketField from './MarketField';
import BtnBuySell from './BtnBuySell';

const SellForm: React.FC<{ state: SwapState }> = ({ state }) => {
  const {
    base: {
      slug: baseSlug,
      balance: baseBalance,
      balanceLoading,
      amount: baseAmount,
      priceByOther,
    },
    isMarketPrice,
    quote: { slug: quoteSlug, setSlug: setQuote, amount: quoteAmount },
    setAmount,
    setPercentage,
  } = state;

  const targetReady = priceByOther !== undefined;
  const marketToAmount = +baseAmount * Number(priceByOther);

  const [tempTarget, setTempTarget] = useState('');
  useEffect(() => {
    setTempTarget(quoteAmount);
  }, [quoteAmount]);

  return (
    <div>
      <AmountInputBox
        max={baseBalance || 0}
        value={baseAmount}
        onChange={setAmount}
        noSuffixPad
        label={<AmountBalanceLabel slug={baseSlug} setAmount={setAmount} />}
        className="mb-2"
        disabled={balanceLoading || !baseBalance}
      />

      <SensibleSteps
        className="mb-3"
        token={quoteSlug}
        balance={baseBalance}
        mode="sell"
        value={baseAmount}
        onClick={newAmount => setAmount(newAmount)}
      />

      <AmountInputBox
        disabled={isMarketPrice}
        value={
          isMarketPrice
            ? targetReady
              ? roundSensible(marketToAmount)
              : '...'
            : tempTarget
        }
        onChange={setTempTarget}
        onBlur={() =>
          setPercentage(
            +tempTarget < marketToAmount
              ? '0'
              : roundSensible((+tempTarget / marketToAmount - 1) * 100),
          )
        }
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
        className="mb-3"
        noSuffixPad
      />
      <MarketField state={state} />
      <BtnBuySell state={state} className="mt-6 w-full" />
    </div>
  );
};

export default SellForm;
