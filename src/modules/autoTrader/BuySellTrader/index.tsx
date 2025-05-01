import { useEffect, useState } from 'react';
import Trader from '../PageTrade/Trader';
import useSwapState from '../QuickSwap/useSwapState';
import { ModeSelector, type TraderModes } from './ModeSelector';
import BuyForm from './BuyForm';
import SellForm from './SellForm';

const BuySellTrader = ({
  slug,
  setQuote,
  loadingClassName,
}: {
  slug: string;
  quote: string;
  setQuote: (newVal: string) => void;
  loadingClassName?: string;
}) => {
  const [mode, setMode] = useState<TraderModes>('buy');
  const state = useSwapState();

  const { setDir, setIsMarketPrice, setBase, quote } = state;
  useEffect(() => {
    setBase(slug);
  }, [setBase, slug]);

  useEffect(() => {
    setQuote(quote);
  }, [quote, setQuote]);

  useEffect(() => {
    if (mode !== 'auto') {
      setDir(mode);
      setIsMarketPrice(true);
    }
  }, [mode, setDir, setIsMarketPrice]);

  return (
    <div className="[&_.id-input]:bg-v1-surface-l2">
      <ModeSelector mode={mode} setMode={setMode} className="mb-4" />

      {mode === 'auto' && (
        <Trader
          quote={quote}
          setQuote={setQuote}
          slug={slug}
          loadingClassName={loadingClassName}
        />
      )}

      {mode === 'buy' && <BuyForm state={state} />}
      {mode === 'sell' && <SellForm state={state} />}
    </div>
  );
};

export default BuySellTrader;
