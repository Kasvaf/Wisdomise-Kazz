import { roundSensible } from 'utils/numbers';
import { Toggle } from 'shared/Toggle';
import Spin from 'shared/Spin';
import AmountInputBox from 'shared/AmountInputBox';
import { type SwapState } from '../QuickSwap/useSwapState';

const MarketField: React.FC<{ state: SwapState }> = ({ state }) => {
  const { to, from, isMarketPrice, setIsMarketPrice } = state;
  const targetReady = from.priceByOther !== undefined;
  const marketToAmount = +from.amount * Number(from.priceByOther);

  return (
    <div className="rounded-lg bg-v1-surface-l2 p-3 text-xs">
      <div className="flex items-center justify-between">
        <div className="text-v1-content-secondary">
          {from.priceByOther && to.amount && from.amount ? (
            <>
              1 {from.coinInfo?.abbreviation} ≈{' '}
              {roundSensible(
                isMarketPrice ? from.priceByOther : +to.amount / +from.amount,
              )}{' '}
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
            onChange={v => {
              setIsMarketPrice(v);
              if (!v && targetReady) {
                to.setAmount(roundSensible(marketToAmount));
              }
            }}
            variant="brand"
          />
        </div>
      </div>

      {!isMarketPrice && (
        <>
          <div className="my-3 w-full border-t border-v1-surface-l4" />
          <div className="mb-1 text-v1-content-secondary">
            % {+to.amount < marketToAmount ? 'Under' : 'Over'} the Market Price
            (Stop Market)
          </div>
          <AmountInputBox
            value={String(
              Math.round(10_000 * Math.abs(+to.amount / marketToAmount - 1)) /
                100,
            )}
            onChange={newVal =>
              to.setAmount(roundSensible((+newVal / 100 + 1) * marketToAmount))
            }
          />
        </>
      )}
    </div>
  );
};

export default MarketField;
