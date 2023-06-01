import AssetStructureChart from "./AssetStructureChart";
import {
  useGetInvestorAssetStructureQuery,
  useLazyGetExchangeAccountHistoricalStatisticQuery,
} from "api/horosApi";
import { floatData } from "utils/utils";
import dayjs from "dayjs";
import HistoricalChartColumn from "./HistoricalChartColumn";
import HistoricalChartLine from "./HistoricalChartLine";
import Spinner from "components/spinner";
import { useEffect } from "react";

const LoadingIndicator = () => {
  return (
    <div className="mt-[50px] flex w-full items-center justify-center">
      <Spinner />
    </div>
  );
};

const Balance = () => {
  const investorAsset = useGetInvestorAssetStructureQuery({});
  const [historicalStatisticTrigger, historicalStatistic] =
    useLazyGetExchangeAccountHistoricalStatisticQuery();
  const fpi = investorAsset?.data?.[0]?.financial_product_instances[0];

  useEffect(() => {
    if (fpi) {
      historicalStatisticTrigger(investorAsset?.data?.[0]?.key);
    }
  }, [fpi]);

  return (
    <div className="mt-5 flex w-full flex-col ">
      <div className="mt-5 flex w-full flex-col rounded bg-gray-dark p-5">
        {historicalStatistic.isLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            <div className="flex flex-row items-center justify-between">
              <p className="text-base text-gray-light">Total Balance</p>

              <div className="flex flex-row items-center justify-end">
                <p className="text-gray-light">
                  Last Update ({dayjs(new Date()).format("YYYY-MM-DD HH:MM:ss")}
                  )
                </p>
              </div>
            </div>
            <h1 className="my-4 text-4xl font-bold text-white">
              {fpi
                ? floatData(
                    investorAsset?.data?.[0]?.main_exchange_account.total_equity
                  )
                : 0}{" "}
              {investorAsset?.data?.[0]?.main_exchange_account.quote.name}
            </h1>
            {fpi && <AssetStructureChart investorAsset={investorAsset.data!} />}
          </>
        )}
      </div>

      <div className="mt-5 flex w-full flex-col rounded bg-gray-dark p-5">
        {historicalStatistic.isLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            <div className="mb-2 flex w-full items-center justify-between">
              <p className="mb-5 text-lg text-gray-light">Total PnL</p>
              <div className="flex flex-col">
                <div className="flex items-center ">
                  <div className="h-[15px] w-[15px] rounded-full bg-success"></div>
                  <p className="ml-2 text-white">Profit</p>
                </div>
                <div className="flex items-center ">
                  <div className="h-[15px] w-[15px] rounded-full bg-error"></div>
                  <p className="ml-2 text-white">Loss</p>
                </div>
              </div>
            </div>

            {fpi && (
              <HistoricalChartColumn
                historicalStatistic={historicalStatistic}
              />
            )}
          </>
        )}
      </div>

      <div className="mt-5 flex w-full flex-col rounded bg-gray-dark p-5">
        {historicalStatistic.isLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            <p className="mb-5 text-lg text-gray-light"> Daily Profits</p>

            {fpi && (
              <HistoricalChartLine
                historicalStatistic={historicalStatistic}
                // exchangeAccountKey={
                //   investorAsset?.data.results[0].trader_instances[0]
                //     ?.exchange_account.key
                // }
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Balance;
