import { useAccountBalance } from 'api/chains';
import { useCoinDetails } from 'api/discovery';
import QuoteQuickSet from 'modules/autoTrader/BuySellTrader/QuoteQuickSet';
import AmountInputBox from 'shared/AmountInputBox';
import AIPresets from './AIPressets';
import AmountBalanceLabel from './AmountBalanceLabel';
import QuoteSelector from './QuoteSelector';
import type { SignalFormState } from './useSignalFormStates';

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

  const { data: quoteBalance, isLoading: balanceLoading } = useAccountBalance({
    slug: quote,
  });

  const coin = useCoinDetails({ slug: baseSlug });
  const isNewBorn = coin?.data?.symbol_labels?.includes('new_born');

  return (
    <div>
      <AmountInputBox
        className="mb-2"
        disabled={isUpdate || balanceLoading || !quoteBalance}
        label={
          <AmountBalanceLabel
            disabled={isUpdate}
            setAmount={setAmount}
            slug={quote}
          />
        }
        max={quoteBalance || 0}
        noSuffixPad
        onChange={setAmount}
        suffix={
          <QuoteSelector
            baseSlug={baseSlug}
            disabled={isUpdate}
            onChange={setQuote}
            value={quote}
          />
        }
        value={amount}
      />

      {!isUpdate && (
        <QuoteQuickSet
          className="mb-3"
          mode="buy"
          onClick={newAmount => setAmount(newAmount)}
          quote={quote}
          value={amount}
        />
      )}

      {!isNewBorn && (
        <AIPresets
          baseSlug={baseSlug}
          data={data}
          noManual={noManualPreset}
          quoteSlug={quote}
        />
      )}
    </div>
  );
};

export default PartIntro;
