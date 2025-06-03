/* eslint-disable import/max-dependencies */
import { useAccountBalance } from 'api/chains';
import AmountInputBox from 'shared/AmountInputBox';
import { useCoinDetails } from 'api';
import SensibleSteps from 'modules/autoTrader/BuySellTrader/SensibleSteps';
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
        className="mb-3"
        disabled={isUpdate || balanceLoading || !quoteBalance}
      />

      {Boolean(quoteBalance) && !isUpdate && (
        <SensibleSteps
          base={quoteBalance}
          value={amount}
          onChange={newAmount => setAmount(newAmount)}
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
