import { Tooltip } from 'antd';
import { ReadableNumber } from 'shared/ReadableNumber';
import Spin from 'shared/Spin';
import { Toggle } from 'shared/Toggle';
import { Button } from 'shared/v1-components/Button';
import { Input } from 'shared/v1-components/Input';
import { Select } from 'shared/v1-components/Select';
import { preventNonNumericInput, roundSensible } from 'utils/numbers';
import type { SwapState } from './useSwapState';

const MarketField: React.FC<{ state: SwapState }> = ({ state }) => {
  const {
    dir,
    from,
    to,
    isMarketPrice,
    setIsMarketPrice,
    percentage,
    limit,
    setLimit,
    limitType,
    setLimitType,
    quote,
  } = state;

  return (
    <div className="text-xs">
      <div className="flex items-center justify-between rounded-lg bg-v1-surface-l1 p-3">
        <div className="text-v1-content-secondary">
          {from.priceByOther ? (
            <>
              1 {from.coinInfo?.abbreviation} ≈{' '}
              <ReadableNumber
                format={{ decimalLength: 3, compactInteger: true }}
                value={+from.priceByOther * (1 + percentage / 100)}
              />{' '}
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
        <Tooltip
          arrow={false}
          overlayClassName="[&_.ant-tooltip-inner]:bg-v1-surface-l1"
          placement="bottom"
          title={
            <div className="flex gap-1">
              {[2, 5, 10, 15, 30].map(x => (
                <Button
                  className="!px-2"
                  key={x}
                  onClick={() =>
                    setLimit(
                      roundSensible(
                        +(limit ?? '0') +
                          +(limit ?? '0') *
                            (x / 100) *
                            (dir === 'buy' ? -1 : 1),
                      ),
                    )
                  }
                  size="2xs"
                  variant="ghost"
                >
                  {dir === 'buy' ? '-' : '+'}
                  {x}%
                </Button>
              ))}
            </div>
          }
          trigger="hover"
        >
          <div>
            <Input
              className="mt-2 w-full pl-px"
              onChange={newValue => setLimit(newValue)}
              onKeyDown={preventNonNumericInput}
              prefixIcon={
                <Select
                  className="w-48"
                  dialogClassName="w-32"
                  onChange={newType => {
                    if (newType) {
                      setLimitType(newType);
                    }
                  }}
                  options={['price', 'market_cap'] as const}
                  render={item => (item === 'price' ? 'Price' : 'Market Cap')}
                  size="sm"
                  surface={1}
                  value={limitType}
                />
              }
              size="md"
              suffixIcon={
                limitType === 'price' ? quote.coinInfo?.abbreviation : '$'
              }
              surface={1}
              type="string"
              value={limit}
            />
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default MarketField;
