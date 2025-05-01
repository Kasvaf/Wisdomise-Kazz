import { clsx } from 'clsx';
import { Spin } from 'antd';
import AmountInputBox from 'shared/AmountInputBox';
import { useActiveNetwork } from 'modules/base/active-network';
import { ReactComponent as WalletIcon } from 'modules/base/wallet/wallet-icon.svg';
import { Button } from 'shared/v1-components/Button';
import { roundSensible } from 'utils/numbers';
import QuoteSelector from '../PageTrade/AdvancedSignalForm/QuoteSelector';
import { type SwapState } from '../QuickSwap/useSwapState';
import MarketField from './MarketField';
import BtnBuySell from './BtnBuySell';

const SellForm: React.FC<{ state: SwapState }> = ({ state }) => {
  const {
    baseFields: {
      balance: baseBalance,
      amount,
      setAmount,
      balanceLoading,
      coinInfo: quoteInfo,
      priceByOther,
    },
    isMarketPrice,
    quoteFields,
    quote,
    setQuote,
    base,
  } = state;

  const net = useActiveNetwork();
  const isNativeQuote =
    (net === 'the-open-network' && quote === 'the-open-network') ||
    (net === 'solana' && quote === 'wrapped-solana');

  const targetReady = priceByOther !== undefined;
  const marketToAmount = +amount * Number(priceByOther);

  const steps =
    baseBalance &&
    [0.25, 0.5, 0.75, 1].map(p => ({
      label: `${p * 100}%`,
      value: roundSensible(p * baseBalance),
    }));

  return (
    <div>
      <AmountInputBox
        max={baseBalance || 0}
        value={amount}
        onChange={setAmount}
        noSuffixPad
        label={
          <div className="flex items-center justify-between text-xs">
            <span>Amount</span>
            {balanceLoading ? (
              <div className="flex items-center text-v1-content-secondary">
                <Spin />
                Reading Balance
              </div>
            ) : (
              baseBalance != null && (
                <div
                  className={clsx(
                    'flex items-center gap-1',
                    !isNativeQuote &&
                      'cursor-pointer text-white/40 hover:text-white',
                  )}
                  onClick={() =>
                    !isNativeQuote && setAmount(String(baseBalance))
                  }
                >
                  {baseBalance ? (
                    <>
                      <span className="flex items-center">
                        <WalletIcon className="mr-1" /> {String(baseBalance)}{' '}
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
        disabled={balanceLoading || !baseBalance}
      />

      {!!steps && (
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

      <AmountInputBox
        disabled={isMarketPrice}
        value={
          isMarketPrice
            ? targetReady
              ? roundSensible(marketToAmount)
              : '...'
            : quoteFields.amount
        }
        onChange={quoteFields.setAmount}
        suffix={
          base &&
          quote && (
            <QuoteSelector baseSlug={base} value={quote} onChange={setQuote} />
          )
        }
        className="mb-3"
      />
      <MarketField state={state} />
      <BtnBuySell state={state} className="mt-6 w-full" />
    </div>
  );
};

export default SellForm;
