import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMyFinancialProductPerfQuery } from 'api/builder';
import InfoBox from 'modules/builder/InfoBox';
import DateRangeSelector from 'shared/DateRangeSelector';
import PriceChange from 'shared/PriceChange';
import Spinner from 'shared/Spinner';
import TitleHint from '../../TitleHint';
import PnlChart from '../../PnlChart';

const TabPerformance = () => {
  const { t } = useTranslation('builder');
  const params = useParams<{ id: string }>();
  const [dateRange, setDateRange] = useState<[Date, Date]>();

  const { data, isLoading } = useMyFinancialProductPerfQuery({
    fpKey: params.id,
    startTime: dateRange?.[0].toISOString(),
    endTime: dateRange?.[1].toISOString(),
  });

  const inputted = Boolean(params.id && dateRange?.[0] && dateRange?.[1]);
  const dateRangeDiff =
    dateRange?.[0] && dateRange?.[1]
      ? Math.round((+dateRange[1] - +dateRange[0]) / (24 * 60 * 60 * 1000)) - 1
      : undefined;

  return (
    <div className="mt-8">
      <div className="mb-8 flex justify-start gap-4 border-b border-white/5 pb-8 mobile:flex-col">
        <DateRangeSelector
          onChange={setDateRange}
          value={dateRange}
          label={t('common:date')}
          defaultRecent={14}
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
            {t('performance.title')}
          </TitleHint>
          <div className="flex items-stretch gap-3 mobile:flex-col-reverse">
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
                    {t('strategy:positions-history.pnl')}{' '}
                    <span className="ml-1 text-xs">
                      {t('performance.asset-under-management')}
                    </span>
                  </>
                }
              >
                <PriceChange
                  value={data.pnl}
                  textClassName="!text-xl"
                  valueToFixed
                />
              </InfoBox>
              <InfoBox
                title={
                  <>
                    {t('products:product-detail.max-drawdown')}{' '}
                    {dateRangeDiff !== undefined && (
                      <span className="text-[#34A3DA99]">{dateRangeDiff}d</span>
                    )}
                  </>
                }
              >
                <PriceChange
                  value={data.max_drawdown}
                  textClassName="!text-xl"
                  valueToFixed
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
