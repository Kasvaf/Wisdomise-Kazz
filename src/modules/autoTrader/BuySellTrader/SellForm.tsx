import { useState } from 'react';
import AmountInputBox from 'shared/AmountInputBox';
import QuoteQuickSet from 'modules/autoTrader/BuySellTrader/QuoteQuickSet';
import { TraderPresetsSettings } from 'modules/autoTrader/BuySellTrader/TraderPresets';
import { convertToBaseAmount } from 'modules/autoTrader/BuySellTrader/utils';
import AmountTypeSwitch from 'modules/autoTrader/BuySellTrader/AmountTypeSwitch';
import QuoteSelector from '../PageTrade/AdvancedSignalForm/QuoteSelector';
import AmountBalanceLabel from '../PageTrade/AdvancedSignalForm/AmountBalanceLabel';
import { type SwapState } from './useSwapState';
import MarketField from './MarketField';
import BtnBuySell from './BtnBuySell';

const SellForm: React.FC<{ state: SwapState }> = ({ state }) => {
  const {
    base: { coinInfo: baseInfo, slug: baseSlug, balance: baseBalance },
    quote: {
      coinInfo: quoteInfo,
      slug: quoteSlug,
      setSlug: setQuote,
      priceByOther,
    },
    setAmount: setBaseAmount,
  } = state;

  const [amount, setAmount] = useState('0');
  const handleBaseAmount = (newValue: string) => {
    setAmount(newValue);
    setBaseAmount(
      convertToBaseAmount(newValue, amountType, baseBalance, priceByOther),
    );
  };

  const [amountType, setAmountType] = useState<'percentage' | 'base' | 'quote'>(
    'percentage',
  );

  return (
    <div>
      <AmountInputBox
        value={amount}
        onChange={handleBaseAmount}
        label={<AmountBalanceLabel slug={baseSlug} />}
        className="mb-2"
        suffix={
          <div className="text-xs">
            {amountType === 'percentage'
              ? '%'
              : amountType === 'base'
              ? baseInfo?.abbreviation
              : baseSlug &&
                quoteInfo && (
                  <QuoteSelector
                    className="-mr-4"
                    value={quoteSlug}
                    baseSlug={baseSlug}
                    onChange={setQuote}
                  />
                )}
          </div>
        }
      />

      <QuoteQuickSet
        className="mb-5"
        quote={quoteSlug}
        balance={baseBalance}
        mode={amountType === 'percentage' ? 'sell_percentage' : 'sell'}
        onClick={newAmount => handleBaseAmount(newAmount)}
        sensible={amountType === 'base'}
      >
        <AmountTypeSwitch
          base={baseSlug}
          quote={quoteSlug}
          value={amountType}
          onChange={newType => {
            setAmountType(newType);
            setAmount('0');
          }}
        />
      </QuoteQuickSet>

      {/* <AmountInputBox */}
      {/*   disabled={isMarketPrice} */}
      {/*   value={ */}
      {/*     isMarketPrice */}
      {/*       ? targetReady */}
      {/*         ? roundSensible(marketToAmount) */}
      {/*         : '...' */}
      {/*       : tempTarget */}
      {/*   } */}
      {/*   onChange={setTempTarget} */}
      {/*   suffix={ */}
      {/*     baseSlug && */}
      {/*     quoteSlug && ( */}
      {/*       <QuoteSelector */}
      {/*         baseSlug={baseSlug} */}
      {/*         value={quoteSlug} */}
      {/*         onChange={setQuote} */}
      {/*       /> */}
      {/*     ) */}
      {/*   } */}
      {/*   className="mb-3" */}
      {/*   noSuffixPad */}
      {/* /> */}
      <MarketField state={state} />
      <TraderPresetsSettings mode="sell" />
      <BtnBuySell state={state} className="mt-6 w-full" />
    </div>
  );
};

export default SellForm;
