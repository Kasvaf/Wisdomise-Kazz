/* eslint-disable import/max-dependencies */
import { useAccountBalance } from 'api/chains';
import AmountInputBox from 'shared/AmountInputBox';
import { Button } from 'shared/v1-components/Button';
import { useCoinDetails } from 'api';
import { type SignalFormState } from './useSignalFormStates';
import AmountBalanceLabel from './AmountBalanceLabel';
import useSensibleSteps from './useSensibleSteps';
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

  const steps = useSensibleSteps(quoteBalance);
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
        <div className="mb-3 flex gap-1.5">
          {steps.map(({ label, value }) => (
            <Button
              key={value}
              size="xs"
              variant={value === amount ? 'primary' : 'ghost'}
              className="!h-6 grow !px-2 enabled:hover:!bg-v1-background-brand enabled:active:!bg-v1-background-brand"
              onClick={() => setAmount(value)}
            >
              {label}
            </Button>
          ))}
        </div>
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
