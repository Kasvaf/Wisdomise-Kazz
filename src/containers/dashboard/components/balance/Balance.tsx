import AssetStructureChart from "./AssetStructureChart";
import {
  useGetInvestorAssetStructureQuery,
  useRefreshExchangeAccountMutation,
  useLazyGetExchangeAccountHistoricalStatisticQuery,
} from "api/horosApi";
import { floatData } from "utils/utils";
import dayjs from "dayjs";
import HistoricalChartColumn from "./HistoricalChartColumn";
import HistoricalChartLine from "./HistoricalChartLine";
import { ReactComponent as UpdateButton } from "@images/updateButton.svg";
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
  const [RefreshExchangeAccountExecuter, refreshExchangeAccount] =
    useRefreshExchangeAccountMutation();

  const onRefresh = async () => {
    if (!refreshExchangeAccount.isLoading) {
      await RefreshExchangeAccountExecuter(
        investorAsset?.data?.results[0]?.trader_instances[0]?.exchange_account
          ?.key
      );
      investorAsset?.refetch(); // TODO : should be checked
    }
  };

  const onClickRefresh = () => {
    window.location.reload();
    // investorAsset?.refetch(); // TODO : should be checked
  };

  const getHistoricalStaticsData = () => {
    if (
      investorAsset?.data &&
      investorAsset?.data?.results?.length > 0 &&
      investorAsset?.data?.results[0]?.trader_instances.length > 0
    ) {
      historicalStatisticTrigger(
        investorAsset?.data?.results[0]?.trader_instances[0]?.exchange_account
          ?.key
      );
    }
  };

  useEffect(() => {
    onRefresh();
    getHistoricalStaticsData();
  }, []);

  return (
    <div className="mt-5 flex w-full flex-col ">
      <div className="mt-5 flex w-full flex-col rounded bg-gray-dark p-5">
        {refreshExchangeAccount.isLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            <div className="flex flex-row items-center justify-between">
              <p className="text-base text-gray-light">Total Balance</p>

              <div className="flex flex-row items-center justify-end">
                <UpdateButton
                  className="mr-2 cursor-pointer"
                  onClick={onClickRefresh}
                />

                <p className="text-gray-light">
                  Last Update(
                  {investorAsset?.data &&
                    investorAsset?.data?.results?.length > 0 &&
                    investorAsset?.data?.results[0]?.trader_instances.length >
                      0 &&
                    dayjs(
                      new Date(
                        investorAsset?.data.results[0].trader_instances[0].exchange_account?.updated_at
                      )
                    ).format("YYYY-MM-DD HH:MM:ss")}{" "}
                  )
                </p>
              </div>
            </div>
            <h1 className="my-4 text-4xl font-bold text-white">
              {investorAsset?.data &&
              investorAsset?.data?.results?.length > 0 &&
              investorAsset?.data?.results[0]?.trader_instances.length > 0
                ? floatData(
                    investorAsset?.data.results[0].trader_instances[0]
                      ?.exchange_account?.total_equity
                  )
                : 0}{" "}
              {investorAsset?.data &&
                investorAsset?.data?.results?.length > 0 &&
                investorAsset?.data?.results[0]?.trader_instances.length > 0 &&
                investorAsset?.data.results[0].trader_instances[0]
                  ?.exchange_account?.quote.name}
            </h1>
            {investorAsset?.data &&
              investorAsset?.data?.results?.length > 0 &&
              investorAsset?.data?.results[0]?.trader_instances.length > 0 && (
                <AssetStructureChart investorAsset={investorAsset} />
              )}
          </>
        )}
      </div>

      <div className="mt-5 flex w-full flex-col rounded bg-gray-dark p-5">
        {refreshExchangeAccount.isLoading ? (
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

            {investorAsset?.data &&
              investorAsset?.data?.results?.length > 0 &&
              investorAsset?.data?.results[0]?.trader_instances.length > 0 && (
                <HistoricalChartColumn
                  historicalStatistic={historicalStatistic}
                />
              )}
          </>
        )}
      </div>

      <div className="mt-5 flex w-full flex-col rounded bg-gray-dark p-5">
        {refreshExchangeAccount.isLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            <p className="mb-5 text-lg text-gray-light"> Daily Profits</p>

            {investorAsset?.data &&
              investorAsset?.data?.results?.length > 0 &&
              investorAsset?.data?.results[0]?.trader_instances.length > 0 && (
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
