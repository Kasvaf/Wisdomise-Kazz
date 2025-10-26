import AmountTypeSwitch from 'modules/autoTrader/BuySellTrader/AmountTypeSwitch';
import QuoteQuickSet from 'modules/autoTrader/BuySellTrader/QuoteQuickSet';
import { TraderPresetsSettings } from 'modules/autoTrader/BuySellTrader/TraderPresets';
import { convertToBaseAmount } from 'modules/autoTrader/BuySellTrader/utils';
import { useEffect, useState } from 'react';
import AmountInputBox from 'shared/AmountInputBox';
import AmountBalanceLabel from '../PageTrade/AdvancedSignalForm/AmountBalanceLabel';
import QuoteSelector from '../PageTrade/AdvancedSignalForm/QuoteSelector';
import BtnBuySell from './BtnBuySell';
import MarketField from './MarketField';
import type { SwapState } from './useSwapState';

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

  useEffect(() => {
    setBaseAmount(
      convertToBaseAmount(amount, amountType, baseBalance, priceByOther),
    );
  }, [amount, amountType, baseBalance, priceByOther, setBaseAmount]);

  return (
    <div>
      <AmountInputBox
        className="mb-2"
        label={<AmountBalanceLabel slug={baseSlug} />}
        onChange={handleBaseAmount}
        suffix={
          <div className="text-xs">
            {amountType === 'percentage'
              ? '%'
              : amountType === 'base'
                ? baseInfo?.symbol
                : baseSlug &&
                  quoteInfo && (
                    <QuoteSelector
                      baseSlug={baseSlug}
                      className="-mr-4"
                      onChange={setQuote}
                      value={quoteSlug}
                    />
                  )}
          </div>
        }
        value={amount}
      />

      <QuoteQuickSet
        balance={baseBalance}
        className="mb-5"
        mode={amountType === 'percentage' ? 'sell_percentage' : 'sell'}
        onClick={newAmount => handleBaseAmount(newAmount)}
        quote={quoteSlug}
        sensible={amountType === 'base'}
      >
        <AmountTypeSwitch
          base={baseSlug}
          onChange={newType => {
            setAmountType(newType);
            setAmount('0');
          }}
          quote={quoteSlug}
          value={amountType}
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
      <BtnBuySell className="mt-6 w-full" state={state} />
    </div>
  );
};

export default SellForm;
