import { useEffect, useState } from 'react';
import useIsMobile from 'utils/useIsMobile';
import Trader from '../PageTrade/Trader';
import type { TraderInputs } from '../PageTrade/types';
import BuyForm from './BuyForm';
import { ModeSelector, type TraderModes } from './ModeSelector';
import SellForm from './SellForm';
import useSwapState from './useSwapState';

const BuySellForms: React.FC<
  TraderInputs & { mode: 'buy' | 'sell'; loadingClassName?: string }
> = inputs => {
  const { mode, slug } = inputs;
  const swapState = useSwapState(inputs);

  const {
    base: { setSlug: setBase },
    setDir,
    setIsMarketPrice,
    firing: [_firing],
    confirming: [_confirming],
    setAmount,
  } = swapState;

  useEffect(() => {
    setBase(slug);
  }, [setBase, slug]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(() => {
    setDir(mode);
    setAmount('0');
  }, [mode, setAmount, setDir, setIsMarketPrice]);

  return (
    <>
      {mode === 'buy' && <BuyForm state={swapState} />}
      {mode === 'sell' && <SellForm state={swapState} />}
    </>
  );
};

const BuySellTrader: React.FC<
  TraderInputs & {
    loadingClassName?: string;
  }
> = inputs => {
  const { positionKey } = inputs;
  const [mode, setMode] = useState<TraderModes>(positionKey ? 'auto' : 'buy');

  const isMobile = useIsMobile();
  return (
    <div className="[&_.id-input]:bg-v1-surface-l1">
      {!positionKey && (
        <ModeSelector className="mb-4" mode={mode} setMode={setMode} />
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
