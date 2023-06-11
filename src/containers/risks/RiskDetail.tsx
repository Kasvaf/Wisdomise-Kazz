import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, Skeleton } from "antd";
import RiskCard from "containers/dashboard/components/RiskCard";
import LineChart from "containers/dashboard/components/LineChart";
import Button from "components/Button";
import { BUTTON_TYPE } from "utils/enums";
import { coins } from "containers/dashboard/constants";
import {
  useGetETFBacktestQuery,
  useGetFinancialProductDetailQuery,
  useGetInvestorAssetStructureQuery,
  useCreateFPIMutation,
} from "api/horosApi";
import { convertDate } from "utils/utils";
import Modal from "components/modal";
import Congratulation from "containers/congratulation";
import { ReactComponent as WarningCircleIcon } from "@images/warningCircle.svg";

export default function RiskDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const [createFPI, createFPIRes] = useCreateFPIMutation();
  const investorAsset = useGetInvestorAssetStructureQuery({});
  const fpData = useGetFinancialProductDetailQuery({ id: params.id });
  const [showCongratulation, setShowCongratulation] = useState(false);
  const etfBacktest = useGetETFBacktestQuery({
    id: params.id,
    params: {
      start_date: convertDate(
        new Date(import.meta.env.VITE_BACKTEST_START_DATE)
      ),
      end_date: convertDate(),
    },
  });

  const onClickCreateWallet = async () => {
    const body = {
      financial_product: {
        key: params.id,
      },
    };
    await createFPI(body);
    setShowCongratulation(true);
  };

  const onGoToDeposit = async () => {
    const res = await investorAsset.refetch();
    setShowCongratulation(false);
    navigate(`/app/deposit/${res.data?.[0]?.main_exchange_account.key}`);
  };

  const onGoToDashboard = async () => {
    await investorAsset.refetch();
    setShowCongratulation(false);
    navigate("/app/dashboard");
  };

  const onActivateClick = () => {
    if (fpData?.data?.subscribable) {
      onClickCreateWallet();
    }
  };

  const hasAnyFPIActive =
    (investorAsset?.data?.[0]?.financial_product_instances.length || 0) > 0;

  const coinIcons: string[] =
    fpData?.data?.config.assets
      .split("#")
      .map((str: string) => str.split("_"))
      .map((parts: string[]) => parts[1])
      .map((coin: string) => coin.toUpperCase())
      .filter((coin: string) => coin in coins)
      .map((coin: string) => coins[coin].icon) || [];

  const uniqueCoinIcons = Array.from(new Set(coinIcons));

  return (
    <>
      <div
        className="customNotification"
        style={createFPIRes.isLoading ? { right: 15 } : { right: -300 }}
      >
        <div className="flex flex-row">
          <WarningCircleIcon />
          <div className="ml-[10px] flex flex-col ">
            <p className="text-[14px] font-bold text-white">
              We’re creating a wallet for you
            </p>
            <p className="text-[14px] font-normal text-white">
              {" "}
              it may take a while …
            </p>
          </div>
        </div>
      </div>
      <div className="mx-2 mt-[100px] flex grid-cols-10  flex-col items-center justify-center sm:mx-[100px]">
        {fpData.isLoading ? (
          <Skeleton.Input className=" mb-4 rounded" active />
        ) : (
          <h2 className="mb-4  text-center text-4xl capitalize text-white">
            {fpData?.data?.title}
          </h2>
        )}

        <p className="w-390  mb-6 w-auto  text-center text-base text-gray-light sm:w-[550px]">
          {fpData?.data?.description}
        </p>
        <div className="risk-detail-coins my-10">
          <Avatar.Group>
            {uniqueCoinIcons.map((icon: string) => (
              <Avatar key={icon} size="large" src={icon} />
            ))}
          </Avatar.Group>
        </div>
        <Button
          type={BUTTON_TYPE.FILLED}
          onClick={onActivateClick}
          text={
            createFPIRes.isLoading
              ? "Loading..."
              : !fpData.data?.subscribable
              ? "Not Activatable"
              : "Activate"
          }
          className="mb-5 w-[340px] sm:mb-20"
          disabled={
            createFPIRes.isLoading ||
            hasAnyFPIActive ||
            !fpData.data?.subscribable
          }
        ></Button>
        <RiskCard
          expectedYield={fpData?.data?.profile.expected_yield}
          maxDrawdown={fpData?.data?.profile.max_drawdown}
          riskRatio={fpData?.data?.profile.return_risk_ratio}
          loading={fpData.isLoading}
          className="sm:w-[820px]"
        />
        <div className="my-5  w-full bg-gray-dark p-5 sm:w-[820px]">
          {fpData.isLoading ? (
            <Skeleton.Input className=" mb-4 rounded" active />
          ) : (
            <h1 className="mb-3 text-xl text-white">
              {fpData?.data?.title} vs. Benchmarks
            </h1>
          )}

          <LineChart
            className="w-full"
            chartData={etfBacktest?.data}
            loading={etfBacktest.isLoading}
            title={fpData?.data?.title}
          />
        </div>
      </div>
      {showCongratulation && (
        <Modal className="!w-full sm:!w-[600px]">
          <Congratulation
            onGoToDeposit={onGoToDeposit}
            onGoToDashboard={onGoToDashboard}
            loading={investorAsset.isFetching}
          />
        </Modal>
      )}
    </>
  );
}
