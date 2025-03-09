/* eslint-disable import/max-dependencies */
import { useParams } from 'react-router-dom';
import { bxPlusCircle } from 'boxicons-quasar';
import { useSymbolInfo } from 'api/symbol';
import { useAccountBalance } from 'api/chains';
import AmountInputBox from 'shared/AmountInputBox';
import Icon from 'shared/Icon';
import Spin from 'shared/Spin';
import { useActiveNetwork } from 'modules/base/active-network';
import { type SignalFormState } from './useSignalFormStates';
import QuoteSelector from './QuoteSelector';
import AIPresets from './AIPressets';

const PartIntro: React.FC<{
  data: SignalFormState;
  baseSlug: string;
}> = ({ data, baseSlug }) => {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) throw new Error('unexpected');

  const {
    isUpdate: [isUpdate],
    amount: [amount, setAmount],
    quote: [quote, setQuote],
  } = data;

  const { data: quoteInfo } = useSymbolInfo(quote);
  const net = useActiveNetwork();
  const isNativeQuote =
    (net === 'the-open-network' && quote === 'the-open-network') ||
    (net === 'solana' && quote === 'wrapped-solana');

  const { data: quoteBalance, isLoading: balanceLoading } =
    useAccountBalance(quote);

  return (
    <div>
      <AmountInputBox
        label={
          <div className="flex items-center justify-between">
            <span>Amount</span>
            {balanceLoading ? (
              <div className="flex items-center text-sm text-v1-content-secondary">
                <Spin />
                Reading Balance
              </div>
            ) : (
              quoteBalance != null && (
                <div
                  className="flex items-center gap-1"
                  onClick={() =>
                    !isUpdate &&
                    !isNativeQuote &&
                    setAmount(String(quoteBalance))
                  }
                >
                  {quoteBalance ? (
                    <>
                      <span className="text-sm text-white/40">
                        Balance: {String(quoteBalance)}{' '}
                        {quoteInfo?.abbreviation}
                      </span>
                      {!isUpdate && !isNativeQuote && (
                        <Icon name={bxPlusCircle} size={16} />
                      )}
                    </>
                  ) : (
                    <span className="text-sm text-v1-content-negative">
                      No Balance
                    </span>
                  )}
                </div>
              )
            )}
          </div>
        }
        max={quoteBalance || 0}
        value={amount}
        onChange={setAmount}
        noSuffixPad
        suffix={
          <QuoteSelector
            baseSlug={slug}
            value={quote}
            onChange={setQuote}
            disabled={isUpdate}
          />
        }
        className="mb-3"
        disabled={isUpdate || balanceLoading || !quoteBalance}
      />

      <AIPresets data={data} baseSlug={baseSlug} quoteSlug={quote} />

      <div className="my-4 border-b border-white/5" />
    </div>
  );
};

export default PartIntro;
