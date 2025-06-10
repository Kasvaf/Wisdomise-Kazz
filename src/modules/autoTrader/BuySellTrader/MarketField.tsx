import { Toggle } from 'shared/Toggle';
import Spin from 'shared/Spin';
import AmountInputBox from 'shared/AmountInputBox';
import { type SwapState } from './useSwapState';

const MarketField: React.FC<{ state: SwapState }> = ({ state }) => {
  const {
    dir,
    from,
    to,
    isMarketPrice,
    setIsMarketPrice,
    percentage,
    setPercentage,
  } = state;

  return (
    <div className="rounded-lg bg-v1-surface-l2 p-3 text-xs">
      <div className="flex items-center justify-between">
        <div className="text-v1-content-secondary">
          {from.priceByOther ? (
            <>
              1 {from.coinInfo?.abbreviation} ≈ {to.amount}{' '}
              {to.coinInfo?.abbreviation}
            </>
          ) : (
            <Spin />
          )}
        </div>

        <div className="flex items-center gap-1">
          Market Price
          <Toggle
            checked={isMarketPrice}
            onChange={setIsMarketPrice}
            variant="brand"
          />
        </div>
      </div>

      {!isMarketPrice && (
        <>
          <div className="my-3 w-full border-t border-v1-surface-l4" />
          <div className="mb-1 text-v1-content-secondary">
            % {dir === 'buy' ? 'Under' : 'Over'} the Market Price (Stop Market)
          </div>
          <AmountInputBox
            value={percentage}
            onChange={setPercentage}
            min={0}
            max={99.99}
          />
        </>
      )}
    </div>
  );
};

export default MarketField;
