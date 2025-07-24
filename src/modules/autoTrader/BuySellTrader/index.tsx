import { useEffect, useState } from 'react';
import useIsMobile from 'utils/useIsMobile';
import BtnInstantTrade from 'modules/autoTrader/BuySellTrader/BtnInstantTrade';
import Trader from '../PageTrade/Trader';
import { type TraderInputs } from '../PageTrade/types';
import FiringHolder from '../PageTrade/FiringHolder';
import { ModeSelector, type TraderModes } from './ModeSelector';
import useSwapState from './useSwapState';
import BuyForm from './BuyForm';
import SellForm from './SellForm';

const BuySellForms: React.FC<
  TraderInputs & { mode: 'buy' | 'sell'; loadingClassName?: string }
> = inputs => {
  const { mode, slug, loadingClassName } = inputs;
  const swapState = useSwapState(inputs);

  const {
    base: { setSlug: setBase },
    setDir,
    setIsMarketPrice,
    firing: [firing],
    confirming: [confirming],
    setAmount,
  } = swapState;

  useEffect(() => {
    setBase(slug);
  }, [setBase, slug]);

  useEffect(() => {
    setDir(mode);
    setAmount('0');
  }, [mode, setAmount, setDir, setIsMarketPrice]);

  return (
    <>
      {mode === 'buy' && <BuyForm state={swapState} />}
      {mode === 'sell' && <SellForm state={swapState} />}

      {(confirming || firing) && (
        <FiringHolder className={loadingClassName} firing={firing} />
      )}
    </>
  );
};

const BuySellTrader: React.FC<
  TraderInputs & {
    loadingClassName?: string;
  }
> = inputs => {
  const { positionKey, slug, quote, setQuote } = inputs;
  const [mode, setMode] = useState<TraderModes>(positionKey ? 'auto' : 'buy');

  const isMobile = useIsMobile();
  return (
    <div className="[&_.id-input]:bg-v1-surface-l2">
      <div className="mb-3 flex justify-end">
        <BtnInstantTrade slug={slug} quote={quote} setQuote={setQuote} />
      </div>
      {!positionKey && (
        <ModeSelector mode={mode} setMode={setMode} className="mb-4" />
      )}

      {mode === 'auto' ? (
        <Trader isMinimal={isMobile} {...inputs} />
      ) : (
        <BuySellForms mode={mode} {...inputs} />
      )}
    </div>
  );
};

export default BuySellTrader;
