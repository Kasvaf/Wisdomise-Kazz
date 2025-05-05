import { clsx } from 'clsx';
import { Spin } from 'antd';
import AmountInputBox from 'shared/AmountInputBox';
import { useActiveNetwork } from 'modules/base/active-network';
import { ReactComponent as WalletIcon } from 'modules/base/wallet/wallet-icon.svg';
import { Button } from 'shared/v1-components/Button';
import QuoteSelector from '../PageTrade/AdvancedSignalForm/QuoteSelector';
import useSensibleSteps from '../PageTrade/AdvancedSignalForm/useSensibleSteps';
import { type SwapState } from './useSwapState';
import MarketField from './MarketField';
import BtnBuySell from './BtnBuySell';

const BuyForm: React.FC<{ state: SwapState }> = ({ state }) => {
  const {
    quoteFields: {
      balance: quoteBalance,
      amount,
      setAmount,
      balanceLoading,
      coinInfo: quoteInfo,
    },
    quote,
    setQuote,
    base,
  } = state;

  const net = useActiveNetwork();
  const isNativeQuote =
    (net === 'the-open-network' && quote === 'the-open-network') ||
    (net === 'solana' && quote === 'wrapped-solana');

  const steps = useSensibleSteps(quoteBalance);

  return (
    <div>
      <AmountInputBox
        max={quoteBalance || 0}
        value={amount}
        onChange={setAmount}
        noSuffixPad
        suffix={
          base &&
          quote && (
            <QuoteSelector baseSlug={base} value={quote} onChange={setQuote} />
          )
        }
        label={
          <div className="flex items-center justify-between text-xs">
            <span>Amount</span>
            {balanceLoading ? (
              <div className="flex items-center text-v1-content-secondary">
                <Spin />
                Reading Balance
              </div>
            ) : (
              quoteBalance != null && (
                <div
                  className={clsx(
                    'flex items-center gap-1',
                    !isNativeQuote &&
                      'cursor-pointer text-white/40 hover:text-white',
                  )}
                  onClick={() =>
                    !isNativeQuote && setAmount(String(quoteBalance))
                  }
                >
                  {quoteBalance ? (
                    <>
                      <span className="flex items-center">
                        <WalletIcon className="mr-1" /> {String(quoteBalance)}{' '}
                        {quoteInfo?.abbreviation}
                      </span>
                    </>
                  ) : (
                    <span className="text-v1-content-negative">No Balance</span>
                  )}
                </div>
              )
            )}
          </div>
        }
        className="mb-2"
        disabled={balanceLoading || !quoteBalance}
      />

      {Boolean(quoteBalance) && (
        <div className="mb-3 flex gap-1.5">
          {steps.map(({ label, value }) => (
            <Button
              key={value}
              size="xs"
              variant={value === amount ? 'primary' : 'ghost'}
              className="!h-6 grow !px-2 enabled:hover:!bg-v1-background-brand enabled:active:!bg-v1-background-brand"
              onClick={() => setAmount(value)}
              surface={2}
            >
              {label}
            </Button>
          ))}
        </div>
      )}

      <MarketField state={state} />
      <BtnBuySell state={state} className="mt-6 w-full" />
    </div>
  );
};

export default BuyForm;
