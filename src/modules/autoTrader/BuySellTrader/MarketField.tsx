import { Tooltip } from 'antd';
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import {
  useChartConvertToUSD,
  useChartIsMarketCap,
} from 'shared/AdvancedChart/chartSettings';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Button } from 'shared/v1-components/Button';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { Input } from 'shared/v1-components/Input';
import { Select } from 'shared/v1-components/Select';
import Spin from 'shared/v1-components/Spin';
import { preventNonNumericInput, roundSensible } from 'utils/numbers';
import type { SwapState } from './useSwapState';

const MarketField: React.FC<{ state: SwapState }> = ({ state }) => {
  const { base, isMarketPrice, setIsMarketPrice, limit, setLimit, quote } =
    state;
  const [chartIsMC, setChartIsMC] = useChartIsMarketCap();
  const [convertToUSD] = useChartConvertToUSD();
  const { marketData } = useUnifiedCoinDetails();

  return (
    <div className="text-xs">
      <div className="flex items-center justify-between rounded-lg bg-v1-surface-l1 py-1 pr-1 pl-3">
        <div className={isMarketPrice ? 'text-white/50' : 'text-white/30'}>
          {base.priceByOther && base.price ? (
            <>
              <span>{chartIsMC ? 'MC' : 'Price'}: </span>
              {convertToUSD && '$'}
              <ReadableNumber
                format={{ decimalLength: 3, compactInteger: true }}
                value={
                  (convertToUSD ? +base.price : +base.priceByOther) *
                  (chartIsMC ? (marketData.totalSupply ?? 0) : 1)
                }
              />{' '}
              {!convertToUSD && quote.coinInfo?.symbol}
            </>
          ) : (
            <Spin />
          )}
        </div>

        <ButtonSelect
          onChange={setIsMarketPrice}
          options={[
            { value: true, label: 'Market' },
            { value: false, label: 'Limit' },
          ]}
          size="xs"
          surface={1}
          value={isMarketPrice}
          variant="default"
        />
      </div>

      {!isMarketPrice && (
        <Tooltip
          arrow={false}
          overlayClassName="[&_.ant-tooltip-inner]:!bg-v1-surface-l1"
          placement="bottom"
          title={
            <div className="flex gap-1">
              {[-0.5, -0.2, -0.1, 0.1, 0.2, 0.5].map(x => (
                <Button
                  className="!px-1"
                  key={x}
                  onClick={() =>
                    setLimit(
                      roundSensible(+(limit ?? '0') + +(limit ?? '0') * x),
                    )
                  }
                  size="3xs"
                  surface={2}
                  variant="ghost"
                >
                  {x > 0 && '+'}
                  {x * 100}%
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
                  className="w-28"
                  dialogClassName="w-20"
                  onChange={newType => {
                    if (newType !== undefined) {
                      setChartIsMC(newType);
                    }
                  }}
                  options={[true, false] as const}
                  render={item => (item ? 'MC' : 'Price')}
                  size="sm"
                  surface={1}
                  value={chartIsMC}
                />
              }
              size="md"
              suffixIcon={convertToUSD ? '$' : quote.coinInfo?.symbol}
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
