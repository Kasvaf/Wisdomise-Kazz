import { useEffect, useState } from 'react';
import useIsMobile from 'utils/useIsMobile';
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
    setDir,
    setIsMarketPrice,
    setBase,
    firing: [firing],
    confirming: [confirming],
  } = swapState;

  useEffect(() => {
    setBase(slug);
  }, [setBase, slug]);

  useEffect(() => {
    setDir(mode);
    setIsMarketPrice(true);
  }, [mode, setDir, setIsMarketPrice]);

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
  const isMobile = useIsMobile();

  const { positionKey } = inputs;
  const [mode, setMode] = useState<TraderModes>(positionKey ? 'auto' : 'buy');

  return (
    <div className="[&_.id-input]:bg-v1-surface-l2">
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
