import dayjs from 'dayjs';
import { useEffect } from 'react';
import { floatData } from 'utils/numbers';
import { useInvestorAssetStructuresQuery } from 'api';
import { useLazyGetExchangeAccountHistoricalStatisticQuery } from 'old-api/horosApi';
import SpinnerV1 from 'modules/shared/SpinnerV1';
import AssetStructureChart from './AssetStructureChart';

const LoadingIndicator = () => {
  return (
    <div className="mt-[50px] flex w-full items-center justify-center">
      <SpinnerV1 />
    </div>
  );
};

const Balance = () => {
  const ias = useInvestorAssetStructuresQuery();
  const [historicalStatisticTrigger, historicalStatistic] =
    useLazyGetExchangeAccountHistoricalStatisticQuery();
  const fpi = ias?.data?.[0]?.financial_product_instances[0];

  useEffect(() => {
    if (fpi) {
      historicalStatisticTrigger(ias?.data?.[0]?.key);
    }
  }, [fpi]);

  return (
    <div className="mt-5 flex w-full flex-col ">
      <div className="mt-5 flex w-full flex-col rounded-2xl bg-white/5 p-5">
        {historicalStatistic.isLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            <div className="flex flex-row items-center justify-between mobile:text-xs">
              <p className="text-base text-gray-light">Total Balance</p>

              <div className="flex flex-row items-center justify-end">
                <p className="text-gray-light">
                  Last Update ({dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')}
                  )
                </p>
              </div>
            </div>
            <h1 className="my-4 text-xl font-bold text-white">
              {fpi ? floatData(ias?.data?.[0]?.total_equity) : 0}{' '}
              {ias?.data?.[0]?.main_exchange_account.quote.name}
            </h1>
            {fpi && <AssetStructureChart investorAsset={ias.data!} />}
          </>
        )}
      </div>
    </div>
  );
};

export default Balance;
