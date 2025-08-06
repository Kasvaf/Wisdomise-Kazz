import { Tooltip } from 'antd';
import { Toggle } from 'shared/Toggle';
import Spin from 'shared/Spin';
import { preventNonNumericInput, roundSensible } from 'utils/numbers';
import { Input } from 'shared/v1-components/Input';
import { Select } from 'shared/v1-components/Select';
import { Button } from 'shared/v1-components/Button';
import { type SwapState } from './useSwapState';

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
      <div className="bg-v1-surface-l1 flex items-center justify-between rounded-lg p-3">
        <div className="text-v1-content-secondary">
          {from.priceByOther ? (
            <>
              1 {from.coinInfo?.abbreviation} ≈{' '}
              {roundSensible(+from.priceByOther * (1 + percentage / 100))}{' '}
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
          <Tooltip
            trigger="hover"
            placement="bottom"
            overlayClassName="[&_.ant-tooltip-inner]:bg-v1-surface-l1"
            arrow={false}
            title={
              <div className="flex gap-1">
                {[2, 5, 10, 15, 30].map(x => (
                  <Button
                    key={x}
                    size="2xs"
                    className="!px-2"
                    variant="ghost"
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
                  >
                    {dir === 'buy' ? '-' : '+'}
                    {x}%
                  </Button>
                ))}
              </div>
            }
          >
            <div>
              <Input
                type="string"
                className="mt-2 w-full pl-px"
                size="md"
                surface={1}
                value={limit}
                onKeyDown={preventNonNumericInput}
                onChange={newValue => setLimit(newValue)}
                prefixIcon={
                  <Select
                    surface={1}
                    size="sm"
                    className="w-48"
                    dialogClassName="w-32"
                    value={limitType}
                    options={['price', 'market_cap'] as const}
                    render={item => (item === 'price' ? 'Price' : 'Market Cap')}
                    onChange={newType => {
                      if (newType) {
                        setLimitType(newType);
                      }
                    }}
                  />
                }
                suffixIcon={
                  limitType === 'price' ? quote.coinInfo?.abbreviation : '$'
                }
              />
            </div>
          </Tooltip>
        </>
      )}
    </div>
  );
};

export default MarketField;
