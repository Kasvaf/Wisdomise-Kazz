/* eslint-disable import/max-dependencies */
import { useAccountBalance } from 'api/chains';
import AmountInputBox from 'shared/AmountInputBox';
import { useCoinDetails } from 'api/discovery';
import QuoteQuickSet from 'modules/autoTrader/BuySellTrader/QuoteQuickSet';
import { type SignalFormState } from './useSignalFormStates';
import AmountBalanceLabel from './AmountBalanceLabel';
import QuoteSelector from './QuoteSelector';
import AIPresets from './AIPressets';

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

  const { data: quoteBalance, isLoading: balanceLoading } =
    useAccountBalance(quote);

  const coin = useCoinDetails({ slug: baseSlug });
  const isNewBorn = coin?.data?.symbol_labels?.includes('new_born');

  return (
    <div>
      <AmountInputBox
        label={
          <AmountBalanceLabel
            slug={quote}
            setAmount={setAmount}
            disabled={isUpdate}
          />
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
        className="mb-2"
        disabled={isUpdate || balanceLoading || !quoteBalance}
      />

      {!isUpdate && (
        <QuoteQuickSet
          className="mb-3"
          quote={quote}
          mode="buy"
          value={amount}
          onClick={newAmount => setAmount(newAmount)}
        />
      )}

      {!isNewBorn && (
        <AIPresets
          data={data}
          baseSlug={baseSlug}
          quoteSlug={quote}
          noManual={noManualPreset}
        />
      )}
    </div>
  );
};

export default PartIntro;
