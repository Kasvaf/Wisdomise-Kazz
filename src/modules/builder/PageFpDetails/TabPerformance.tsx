import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMyFinancialProductPerfQuery } from 'api/builder';
import InfoBox from 'modules/builder/InfoBox';
import DateRangeSelector from 'shared/DateRangeSelector';
import PriceChange from 'shared/PriceChange';
import Spinner from 'shared/Spinner';
import TitleHint from '../TitleHint';
import PnlChart from '../PnlChart';

const TabPerformance = () => {
  const params = useParams<{ id: string }>();
  const [dateRange, setDateRange] = useState<[Date, Date]>();

  const { data, isLoading } = useMyFinancialProductPerfQuery({
    fpKey: params.id,
    startTime: dateRange?.[0].toISOString(),
    endTime: dateRange?.[1].toISOString(),
  });

  const inputted = Boolean(params.id && dateRange?.[0] && dateRange?.[1]);

  return (
    <div className="mt-8">
      <div className="mb-8 flex justify-start gap-4 border-b border-white/5 pb-8">
        <DateRangeSelector
          onChange={setDateRange}
          value={dateRange}
          label="Date"
        />
      </div>

      {inputted && isLoading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
      {data && inputted && (
        <>
          <TitleHint title="P/L Chart" className="mb-3">
            Your Chart data updates by changing date range
          </TitleHint>
          <div className="flex items-stretch gap-3 mobile:flex-col">
            <div className="flex basis-2/3 flex-col">
              <div className="grow rounded-2xl bg-black/40 p-4">
                <PnlChart data={data.equities} />
              </div>
            </div>
            <div className="flex basis-1/3 flex-col gap-3">
              <InfoBox title="Virtual Positions">{data.positions}</InfoBox>
              <InfoBox
                title={
                  <>
                    P/L{' '}
                    <span className="ml-1 text-xs">Asset Under Management</span>
                  </>
                }
              >
                <PriceChange value={data.pnl} textClassName="!text-xl" />
              </InfoBox>
              <InfoBox
                title={
                  <>
                    Max Drawdown <span className="text-[#34A3DA99]">7d</span>
                  </>
                }
              >
                <PriceChange
                  value={data.max_drawdown}
                  textClassName="!text-xl"
                />
              </InfoBox>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TabPerformance;
